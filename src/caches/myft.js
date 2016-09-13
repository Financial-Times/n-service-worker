import router from '../utils/router';;

import { getHandler } from '../utils/handlers';
import { registerCache } from '../utils/personal';
import cache from '../utils/cache';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'myft',
		maxAge: 60 * 60 * 12
	}
};

function purgeCache (request) {
	let resource = request.url.replace('/user', '');

	cache('next:myft')
		.then(cache => cache.clear())

	return fetch(request)
}

registerCache('next:myft');

router.get('/__myft/api/*', getHandler({strategy: 'cacheFirst', flag: 'swMyftCaching'}), options);
router.put('/__myft/api/*', purgeCache);
router.post('/__myft/api/*', purgeCache);
router.delete('/__myft/api/*', purgeCache);
