const cache = require('../utils/cache').CacheWrapper;


/**
 * purges the Service worker cache for a given request
 * @param request
 * @returns Promise
 */
export function purgeCache (request) {
	let resource = request.url.replace('/user', '');

	cache('next:myft-v1')
		.then(cache => cache.keys())
		.then(keys => keys.some(key => {
			if (resource.indexOf(key.url) === 0) {
				cache.delete(key);
				return true;
			}
		}));

	return fetch(request);
}
