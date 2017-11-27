import router from '../utils/router';

import { getHandler } from '../utils/handlers';
import { registerCache } from '../utils/personal';
const cache = require('../utils/cache').CacheWrapper;

const options = {
	origin: self.host || 'https://www.ft.com',
	cache: {
		name: 'myft',
		maxAge: 60 * 60 * 12
	}
};

function purgeCache (request) {
	let resource = request.url.replace('/user', '');

	cache('next:myft')
		.then(cache => cache.keys())
		.then(keys => keys.some(key => {
			if (resource.indexOf(key.url) === 0) {
				cache.delete(key);
				return true;
			}
		}));

	return fetch(request);
}

registerCache('next:myft');

router.get('/__myft/api/*', getHandler({strategy: 'cacheFirst', flag: 'swMyftCaching'}), options);
router.put('/__myft/api/*', purgeCache);
router.post('/__myft/api/*', purgeCache);
router.delete('/__myft/api/*', purgeCache);
