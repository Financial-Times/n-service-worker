import router from '../utils/router';

import { getHandler } from '../utils/handlers';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'polyfill-v1',
		maxEntries: 4
	}
};

// use fastest as we want to send requests to check last-modified headers for polyfill
router.get('/__origami/service/polyfill/*', getHandler({strategy: 'fastest', flag: 'swAssetCaching'}), options);
