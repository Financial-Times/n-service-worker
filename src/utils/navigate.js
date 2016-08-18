self.addEventListener('fetch', ev => {
	if (ev.request.mode === 'navigate') {
		// request is event.request sent by browser here
		var req = new Request(ev.request.url, {
				method: ev.request.method,
				headers: ev.request.headers,
				mode: 'same-origin', // need to set this properly
				credentials: ev.request.credentials,
				redirect: 'manual'   // let browser handle redirects
		});
		req.headers.set('ft-next-sw', 'true');
		ev.respondWith(fetch(req));
	}
})
