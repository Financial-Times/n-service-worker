import toolbox from 'sw-toolbox';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'next:content',
		maxAgeSeconds: 60
	}
};

toolbox.router.get('/', toolbox.fastest, options);

toolbox.router.get('/content/:uuid', request => {
	// use the cache if we have it, otherwise fetch (but don't cache the response)
	return caches.match(request)
		.then(response => response ? response : fetch(request))
}, options);

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'cacheContent') {
		// each content object contains a `url` and optional `cacheAge` property
		(msg.content || []).forEach(content => {
			const contentRequest = new Request(content.url, { credentials: 'same-origin' });
			toolbox.networkOnly(contentRequest)
				.then(response => {
					// if it's not a barrier, cache
					// NOTE: this is making another request, just so we can use the toolbox's cache expiration logic;
					// need to pull that out as a low-level helper
					if (response.headers.get('X-Ft-Auth-Gate-Result') !== 'DENIED') {
						const cacheOptions = Object.assign(
							{}, options.cache, content.cacheAge ? { maxAgeSeconds: content.cacheAge} : null
						);
						return toolbox.cacheFirst(contentRequest, null, { cache: cacheOptions })
					}
				})
				.catch(() => { })
		});
	}
});
