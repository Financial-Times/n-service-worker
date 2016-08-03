import toolbox from 'sw-toolbox';

import cache from '../utils/cache';

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
					return [];
				}
				const cacheName = `${options.cache.name}:${uuid}`;
				// each content object contains a `url` and optional `cacheAge` property
				const fetches = (msg.content || [])
					// filter duplicates
					.filter((item, index, content) => content.indexOf(item) === index)
					.map(item => {
						const request = new Request(item.url, { credentials: 'same-origin' });
						// no need to make the request if we already have the content in cache
						return caches.match(request, { cacheName })
							.then(response => {
								if (response) {
									return response
								}
								return fetch(request)
									.then(response => {
										// if it's not a barrier, cache
										// NOTE: this is making another request, just so we can use the toolbox's cache expiration logic;
										// need to pull that out as a low-level helper
										if (response.headers.get('X-Ft-Auth-Gate-Result') !== 'DENIED') {
											return cache(request, {
												cache: {
													name: cacheName,
													maxAgeSeconds: item.cacheAge || 60
												}
											});
										}
									})
									.catch(() => { });
							});
					});
				return Promise.all(fetches);
		});
	}
});
