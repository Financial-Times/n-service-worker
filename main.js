const message = msg => {

	return new Promise((resolve, reject) => {
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
		navigator.serviceWorker.controller.postMessage(msg, [messageChannel.port2]);
	});
}

const register = flags => {
	if ('serviceWorker' in navigator && flags.get('serviceWorker')) {
		return navigator.serviceWorker.register('/__sw.js')
			.then(() => {
				return message({
					type: 'flagsUpdate',
					flags
				});
			});
	};

	return Promise.resolve(false);
};

const unregister = () => {
	if ('serviceWorker' in navigator) {
		return navigator.serviceWorker.getRegistration()
			.then(registration => registration ? registration.unregister() : false);
	}
	return Promise.resolve(false);
};

export { register, unregister, message };
