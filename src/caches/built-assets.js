import toolbox from 'sw-toolbox';

import flags from '../utils/flags';
import { cacheFirstFlagged } from '../utils/handlers';

// TODO have one cache for our more actively developed apps,
// another with longer cache life for errors, opt-out etc
const cacheOptions = {
	origin: 'https://next-geebee.ft.com',
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

// prod
toolbox.router.get('/hashed-assets/:appName/:assetHash/:cssName.css', cacheFirstFlagged, cacheOptions);
toolbox.router.get('/hashed-assets/:appName/:assetHash/:cssName.js', cacheFirstFlagged, cacheOptions);
