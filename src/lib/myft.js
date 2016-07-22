import toolbox from 'sw-toolbox';
import {cacheFirst} from '../utils/flagged-toolbox';
import precache from '../utils/precache';
import {registerCache, getCacheKey} from '../utils/personal';

const endPoints = ['preferred/preference', 'enabled/endpoint', 'created/list', 'followed/concept', 'saved/content'];

function getCacheOptions () {
	return {
		cache: {
			name: getCacheKey('next:myft'),
			maxAgeSeconds: 60 * 60 * 24
		}
	}
};

function clearCache (request, values, options) {
	let resource = request.url.split('/');
	resource.pop();
	caches.delete(new Request(resource.join('/')));
	return fetch(request);
}

// this will error if has no session token yet
registerCache('next:myft')
	.then(() => {
		toolbox.router.get('/__myft/api/*', cacheFirst('swMyftCaching'), getCacheOptions());
		toolbox.router.put('/__myft/api/*', clearCache);
		toolbox.router.post('/__myft/api/*', clearCache);
		toolbox.router.delete('/__myft/api/*', clearCache);
	});
