import cache from '../utils/cache';

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