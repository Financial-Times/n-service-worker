const message = msg => {
	if ('serviceWorker' in navigator) {
		return navigator.serviceWorker.ready
			.then(registration =>
				new Promise((resolve, reject) => {
					// Create a Message Channel
					const messageChannel = new MessageChannel();
					// Handler for recieving message reply from service worker
					messageChannel.port1.onmessage = ev => {
						if (ev.data.error) {
							reject(ev.data.error);
						} else {
							resolve(ev.data);
						}
					};
					// Send message to service worker along with port for reply
					registration.active.postMessage(msg, [messageChannel.port2]);
				})
			);
	} else {
		return Promise.reject('Service Worker unavailable');
	}
};

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
							//only needed while rolling out the new SW wit new flags mechanism
							//TODO delete in a few days 9/1/18
							message({
								type: 'flagsUpdate',
								flags: JSON.parse(JSON.stringify(flags))
							});
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

	return new Promise((res, rej) => {
		try {
			const connection = indexedDB.open('next-flags', 1);

			connection.onupgradeneeded = () => {
				const db = connection.result;
				db.createObjectStore('flags', );
			};

			connection.onsuccess = () => {
				const db = connection.result;
				const tx = db.transaction('flags', 'readwrite');
				const store = tx.objectStore('flags');

				store.put(JSON.parse(JSON.stringify(flags)), 'flags');

				tx.oncomplete = () => {
					db.close();
					res();
				};

				tx.onerror = () => rej(tx.error);
				tx.onabort = () => rej(tx.error);
			};
		} catch (e) {
			// Squash this useless error.
			if (e.message !== 'UnknownError') rej(e);
		}
	})
		// resets the throttling of flags calls, meaning latest flags are picked up
		// fairly instantly
		.then(() => message({type: 'flagsClobber'}));
}

const unregister = () => {
	if ('serviceWorker' in navigator) {
		return navigator.serviceWorker.getRegistration()
			.then(registration => registration ? registration.unregister() : false);
	} else {
		return Promise.resolve(false);
	}
};

export { register, unregister, passFlags, message };
