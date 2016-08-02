import toolbox from 'sw-toolbox';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'next:content',
		maxAgeSeconds: 60
	}
};

const getUuid = () =>
	caches.match(new Request('https://session-next.ft.com/uuid'), { cacheName: 'next:session' })
		.then(response => response ? response.clone().json() : { })
		.then(({ uuid }) => uuid)
		.catch(() => { });

toolbox.router.get('/', toolbox.fastest, options);

toolbox.router.get('/content/:uuid', request =>
	getUuid()
		.then(uuid => {
			if (!uuid) {
				return fetch(request);
			}
			return caches.match(request, { cacheName: `${options.cache.name}:${uuid}` })
				.then(response => response || fetch(request))
				.catch(() => fetch(request));
		})
);

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'cacheContent') {
		getUuid()
			.then(uuid => {
				// only cache if we have a uuid
				if (!uuid) {
					return Promise.resolve([]);
				}
				// each content object contains a `url` and optional `cacheAge` property
				const fetches = (msg.content || []).map(content => {
					const request = new Request(content.url, { credentials: 'same-origin' });
					return fetch(request)
						.then(response => {
							// if it's not a barrier, cache
							// NOTE: this is making another request, just so we can use the toolbox's cache expiration logic;
							// need to pull that out as a low-level helper
							if (response.headers.get('X-Ft-Auth-Gate-Result') !== 'DENIED') {
								return toolbox.cacheFirst(request, null, {
									cache: {
										name: `${options.cache.name}:${uuid}`,
										maxAgeSeconds: content.cacheAge || 60
									}
								});
							}
						})
						.catch(() => { });
				});
				return Promise.all(fetches);
		});
	}
});
