import toolbox from 'sw-toolbox';

import { cacheFirstFlagged } from '../utils/handlers';
import { registerCache } from '../utils/personal';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'myft',
		maxAge: 60 * 60 * 12
	}
};

function purgeCache (request) {
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

registerCache('next:myft');

toolbox.router.get('/__myft/api/*', cacheFirstFlagged('swMyftCaching'), options);
toolbox.router.put('/__myft/api/*', purgeCache);
toolbox.router.post('/__myft/api/*', purgeCache);
toolbox.router.delete('/__myft/api/*', purgeCache);
