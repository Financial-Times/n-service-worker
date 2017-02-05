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
}

const register = flags => {
	if ('serviceWorker' in navigator && flags.get('serviceWorker')) {
		if (document.cookie.length > 4000) {
			console.warn('Cookie is greater than 4000 characters - unregistering service worker due to potential failure to retrieve updates'); //eslint-disable-line
			return unregister();
		}

		const swEnv = flags.get('swQAVariant') ||
			(flags.get('swCanaryRelease') && nUi.sampleUsers(5, 'sw-canary')) ? 'canary' : 'prod'

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

					}
				}

				passFlags(JSON.parse(JSON.stringify(flags)))
					.then(() => registration);
			});

	} else {
		return Promise.reject('Service Worker unavailable, or serviceWorker flag off');
	}
};

const unregister = () => {
	if ('serviceWorker' in navigator) {
		return navigator.serviceWorker.getRegistration()
			.then(registration => registration ? registration.unregister() : false);
	} else {
		return Promise.resolve(false);
	}
};

// Make sure install barrier never gets shown
// (at least while we consider the web app's role)
window.addEventListener('beforeinstallprompt', ev => {
	ev.preventDefault();
	return false;
});

function passFlags (flags) {
	return message({
		type: 'flagsUpdate',
		flags: flags
	})
}

export { register, unregister, message, passFlags };
