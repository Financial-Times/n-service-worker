const register = flags => {
	if ('serviceWorker' in navigator && flags.get('serviceWorker')) {
		if (document.cookie.length > 4000) {
			console.warn('Cookie is greater than 4000 characters - unregistering service worker due to potential failure to retrieve updates'); //eslint-disable-line
			return unregister();
		}

		const sampleUsers = require('./src/utils/sampleUsers').sampleUsers;

		const swEnv = flags.get('swQAVariant') ||
			((flags.get('swCanaryRelease') && sampleUsers(3, 'sw-canary')) ? 'canary' : 'prod');

		passFlags(flags);

		// TODO add something to tracking & o-errors config to determine the version
		return navigator.serviceWorker.register(`/__sw-${swEnv}.js`)
			.then(registration => {

				// signify install event to window
				registration.onupdatefound = function () {
					// The updatefound event implies that registration.installing is set; see
					// https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
					const installingWorker = registration.installing;

					installingWorker.onstatechange = function () {
						switch (installingWorker.state) {
							case 'installed':
								if (!navigator.serviceWorker.controller) {
									window.postMessage({command: 'precacheDone'}, '*');
								}
							break;

							case 'redundant':
								throw Error('The installing service worker became redundant.');
						}

					};
				};


			});

	} else {
		return Promise.reject('Service Worker unavailable, or serviceWorker flag off');
	}
};

function passFlags (flags) {
	const open = indexedDB.open('next-flags', 1);

	open.onupgradeneeded = () => {
		const db = open.result;
		db.createObjectStore('flags');
	};

	open.onsuccess = () => {
		const db = open.result;
		const tx = db.transaction('flags', 'readwrite');
		const store = tx.objectStore('flags');

		store.put(JSON.parse(JSON.stringify(flags)));

		tx.oncomplete = () => db.close();
	};
}

const unregister = () => {
	if ('serviceWorker' in navigator) {
		return navigator.serviceWorker.getRegistration()
			.then(registration => registration ? registration.unregister() : false);
	} else {
		return Promise.resolve(false);
	}
};

export { register, unregister, passFlags };
