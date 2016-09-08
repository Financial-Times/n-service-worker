self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'claim') {
		self.clients.claim();
		ev.ports[0].postMessage('claimed')
	}
});

import '../../src/__sw'
