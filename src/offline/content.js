import toolbox from 'sw-toolbox';

import * as fonts from '../utils/fonts';

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

// toolbox.router.get('/content/:uuid', request => {
// 	return Promise.all([getUuid(), fonts.areCached()])
// 		.then(([uuid, fontsAreCached]) => {
// 			const url = `${request.url}${request.url.includes('?') ? '&' : '?'}fonts-cached=true`;
// 			const newRequest = fontsAreCached ? new Request(url, { credentials: 'same-origin' }) : request;
// 			if (!uuid) {
// 				return fetch(newRequest);
// 			}
// 			return caches.match(newRequest, { cacheName: `${options.cache.name}:${uuid}` })
// 				.then(response => response || fetch(newRequest))
// 				.catch(() => fetch(newRequest));
// 		})
// }, options);

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'cacheContent') {
		getUuid()
			.then(uuid => {
				// only cache if we have a uuid
				if (!uuid) {
					return [];
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
