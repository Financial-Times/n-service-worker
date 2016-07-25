import toolbox from 'sw-toolbox';
import {cacheFirst} from '../utils/flagged-toolbox';

const cacheOptions = {
	cache: {
		name: 'next:myft',
		maxAgeSeconds: 60 * 60 * 12
	}
};

function clearCache (request) {
	let resource = request.url.split('/');
	resource.pop();
	caches.delete(new Request(resource.join('/')));
	return fetch(request);
}

toolbox.router.get('/__myft/api/*', cacheFirst('swMyftCaching'), cacheOptions);
toolbox.router.put('/__myft/api/*', clearCache);
toolbox.router.post('/__myft/api/*', clearCache);
toolbox.router.delete('/__myft/api/*', clearCache);
