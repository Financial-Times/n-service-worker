import toolbox from 'sw-toolbox';

import cache from '../utils/cache';
import { registerCache } from '../utils/personal';
import { cacheFirst } from '../utils/handlers';

const options = {
	origin: self.registration.scope.replace(/\/$/, '')
};

const getUuid = () =>
	cache('session')
		.then(cache => cache.get('https://session-next.ft.com/uuid'))
		.then(response => response ? response.json() : { })
		.then(({ uuid }) => uuid)
		.catch(() => { });

registerCache('next:front-page');

toolbox.router.get('/', request =>
	// only cache if logged in
	// NOTE: using whether there's a uuid in the session store as a proxy for logged in-ness
	getUuid()
		.then(uuid =>
			uuid ? cacheFirst(request, null, { cache: { name: 'front-page' } }): fetch(request)
		),
options);

toolbox.router.get('/content/:uuid', request =>
	getUuid()
		.then(uuid =>
			uuid ? cacheFirst(request, null, { cache: { name: `content:${uuid}` } }): fetch(request)
		),
options);

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'cacheContent') {
		getUuid()
			.then(uuid => {
				// only cache if we have a uuid
				if (!uuid) {
					return [];
				}
				return cache(`content:${uuid}`)
					.then(cache => {
						// each content object contains a `url` and optional `cacheAge` property
						const fetches = (msg.content || [])
							// filter duplicates
							.filter((item, index, content) => content.indexOf(item) === index)
							.map(item => {
								const request = new Request(item.url, { credentials: 'same-origin' });
								// no need to make the request if we already have the content in cache
								return cache.get(request)
									.then(response => {
										if (response) {
											return response
										}
										return fetch(request)
											.then(response => {
												// if it's not a barrier, cache
												if (response.headers.get('X-Ft-Auth-Gate-Result') !== 'DENIED') {
													return cache.set(request, { response, maxAge: item.cacheAge });
												}
											})
											.catch(() => { });
									});
							});
						return Promise.all(fetches);
					});
		});
	}
});
