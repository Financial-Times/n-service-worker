import toolbox from 'sw-toolbox';

const cacheOptions = {
	origin: 'https://*.ft.com',
	cache: {
		name: 'next:content',
		// our code base moves so fast, pointless caching enything longer than a few days
		maxAgeSeconds: 60
	}
};

toolbox.router.get('/', toolbox.fastest, cacheOptions);

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
			const contentCacheOptions = Object.assign(
				{}, cacheOptions.cache, content.cacheAge ? { maxAgeSeconds: content.cacheAge} : null
			);
			const options = Object.assign({}, cacheOptions, { cache: contentCacheOptions });
			// only get the content if we don't already have it
			toolbox.cacheFirst(new Request(content.url), null, options);
		});
	}
});
