import router from '../utils/router';;

import { getHandler } from '../utils/handlers';

const options = {
	origin: 'https://www.ft.com',
	cache: {
		name: 'n-ui',
		maxEntries: 8
	}
};

// n-ui route
// use toolbox.fastest as we want to send requests to check last-modified headers for n-ui bundle
router.get('/__assets/n-ui/*', getHandler({strategy: 'fastest', upgradeToCors: true}), options);
