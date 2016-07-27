function logError (err) {
	self.clients.matchAll({
		type: 'window'
	})
		.then(clients => {
			if (!clients.length) {
				return;
			}
			let client;
			if (clients.length === 1) {
				client = clients[0];
			} else {
				// use some rough heuristics to get the current active window
				client = clients.filter(c => c.focused && c.frameType === 'top-level')[0] ||
					clients.filter(c => c.focused)[0] ||
					clients.filter(c => c.visibilityState === 'visible')[0] ||
					clients[0];
			}
			// Send message to the client
			client.postMessage({
				type: 'nServiceWorker.error',
				// cannot send the stack via post message
				error: {
					message: err.message
				}
			});
		})
}

self.addEventListener('error', logError);

export default logError;

setInterval(() => {
	logError(new Error('asdmsakdha'))
}, 5000);
