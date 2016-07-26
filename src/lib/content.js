import toolbox from 'sw-toolbox';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
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
			// only get the content if we don't already have it
			// NOTE: odd that we put something in the cache, only to potentially immediately remove it, but that's
			// so we get sw-toolbox's caching extras
			toolbox.cacheFirst(new Request(content.url, { credentials: 'same-origin' }), null, { cache: cacheOptions })
				.then(response => {
					// if it's a barrier, remove from cache
					if (response.headers.get('X-Ft-Auth-Gate-Result') === 'DENIED') {
						toolbox.uncache(content.url);
					}
				})
		});
	}
});
