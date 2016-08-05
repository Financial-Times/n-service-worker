import toolbox from 'sw-toolbox';

import cache from '../utils/cache';
import { getFlag } from '../utils/flags';
import { registerCache } from '../utils/personal';

const options = {
	origin: 'https://session-next.ft.com'
};

registerCache('next:session');

toolbox.router.get('/(uuid)?', request => {
	return getFlag('swSessionCaching') ?
		cache('session')
			.then(cache => {
				return cache.getOrSet(request, { maxAge: 60 * 60 });
			})
			.catch(err => {
				console.log(err);
				return fetch(request);
			}) :
		fetch(request);
}, options);
