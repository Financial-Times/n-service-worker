import router from '../utils/router';

import { getHandler } from '../utils/handlers';
import precache from '../utils/precache';

const options = {
	origin: /^https\:\/\/(local|www)(\.ft\.com)/,
	cache: {
		name: 'offline-ft'
	}
};

precache(
	options.cache.name,
	[
		new Request('https://local.ft.com:5050/__offline/landing', {
			credentials: 'same-origin',
			mode: 'cors'
		})
	],
	{ maxAge: 60 * 60 * 2 }
);

router.get('/__offline/landing', getHandler({strategy: 'cacheFirst', flag: 'offlineLandingTestPage', upgradeToCors: true}), options);
