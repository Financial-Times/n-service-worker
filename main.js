const message = msg => {
	if ('serviceWorker' in navigator) {
		return navigator.serviceWorker.ready
			.then((registration) =>
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
		return navigator.serviceWorker.register('/__sw.js')
			.then(registration => {
				message({
					type: 'flagsUpdate',
					flags: JSON.parse(JSON.stringify(flags)) // to avoid error caused by the getters
				});
				return registration;
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

export { register, unregister, message };
