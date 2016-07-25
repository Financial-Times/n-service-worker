import toolbox from 'sw-toolbox';

const options = {
	origin: 'https://*.ft.com',
	cache: {
		name: 'next:content',
		maxAgeSeconds: 60
	}
};

toolbox.router.get('/', toolbox.fastest, options);

toolbox.router.get('/content/:uuid', request =>
	// use the cache if we have it, otherwise fetch (but don't cache the response)
	caches.match(request)
		.then(response => response ? response : fetch(request))
);

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'cacheContent') {
		// each content object contains a `url` and optional `cacheAge` property
		(msg.content || []).forEach(content => {
			// copy
			const cacheOptions = Object.assign(
				{}, options.cache, content.cacheAge ? { maxAgeSeconds: content.cacheAge} : null
			);
			const contentOptions = Object.assign({}, options, { cache: cacheOptions });
			// only get the content if we don't already have it
			toolbox.cacheFirst(new Request(content.url, { credentials: 'same-origin' }), null, contentOptions)
				.then(response => {
					// if it's a barrier, remove from cache
					if (response.headers.get('X-Ft-Auth-Gate-Result') === 'DENIED') {
						toolbox.uncache(content.url);
					}
				})
		});
	}
});
