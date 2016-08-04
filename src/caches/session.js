import toolbox from 'sw-toolbox';

import cache from '../utils/cache';
import { get as getFlag } from '../utils/flags';
import { registerCache } from '../utils/personal';

const options = {
	origin: 'https://session-next.ft.com'
};

registerCache('next:session');

toolbox.router.get('/(uuid)?', request =>
	getFlag('swSessionCaching') ?
		cache('session')
			.then(cache => cache.getOrAdd(request, { maxAge: 60 * 60 }))
			.catch(() => fetch(request)) :
		fetch(request),
options);
