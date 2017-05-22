import router from '../utils/router';;

import { getHandler } from '../utils/handlers';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'n-ui',
		maxEntries: 8,
		// our code base moves so fast, pointless caching enything longer than a few days
		maxAge: 60 * 60 * 24 * 5
	}
};

// n-ui route
// use toolbox.fastest as we want to send requests to check last-modified headers for n-ui bundle
router.get('/__assets/n-ui/*', getHandler({strategy: 'cacheFirst', flag: 'swAssetCaching'}), options);
