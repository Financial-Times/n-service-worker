self.addEventListener('activate', () => {
	self.registration
		.unregister()
		.then(() => (
			self.clients.matchAll()
		))
		.then((clients) => {
			clients.forEach((client) => {
				if (client && client.url && 'navigate' in client) {
					client.navigate(client.url);
				}
			});
		});
});
