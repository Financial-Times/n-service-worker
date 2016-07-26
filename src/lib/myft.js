import toolbox from 'sw-toolbox';
import {cacheFirst} from '../utils/flagged-toolbox';
const cacheOptions = {
	cache: {
		name: 'next:myft',
		maxAgeSeconds: 60 * 60 * 12
	}
};

function clearCache (request) {
	const networkResponse = fetch(request);
	let resource = request.url.replace('/user', '');

	caches.open('next:myft').then(cache => {
		cache.keys().then(keys => keys.some(key => {
			if (resource.indexOf(key.url) === 0) {
				cache.delete(key);
				return true;
			}
		}))
	})

	return networkResponse
}

toolbox.router.get('/__myft/api/*', cacheFirst('swMyftCaching'), cacheOptions);
toolbox.router.put('/__myft/api/*', clearCache);
toolbox.router.post('/__myft/api/*', clearCache);
toolbox.router.delete('/__myft/api/*', clearCache);
