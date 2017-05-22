import router from '../utils/router';;

import flags from '../utils/flags';
import { getHandler } from '../utils/handlers';

// TODO have one cache for our more actively developed apps,
// another with longer cache life for errors, opt-out etc
const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'built-assets',
		maxEntries: 20,
		// our code base moves so fast, pointless caching enything longer than a few days
		maxAge: 60 * 60 * 24 * 5
	}
};

self.addEventListener('message', msg => {
	const data = msg.data;
	if (data.type === 'hashedAssetsUpdate' && flags.get('swPrecacheHashedAssets')) {
		// TODO work out how an app can retrieve info about the asset hashes for the other 3 main apps
	}
});

const cacheFirst = getHandler({strategy: 'cacheFirst', flag: 'swAssetCaching'})

// prod
router.get('/__assets/hashed/:appName/:assetHash/:cssName.css', cacheFirst, options);
router.get('/__assets/hashed/:appName/:assetHash/:cssName.js', cacheFirst, options);
