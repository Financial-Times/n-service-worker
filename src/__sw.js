/**
 * Handlers are passed in like this for testability.
 * TODO: There's probably a better way to do this, maybe a config file
 */
import router from './utils/router';
import { messageHandler } from './messages';
const cache = require('./utils/cache');
import { getHandler } from './utils/handlers';
import './utils/flags';

// generic assets
import imageCache from './caches/image';
imageCache(getHandler({strategy: 'cacheFirst', flag: 'swAssetCaching'}));

import builtAssetsCache from './caches/built-assets';
builtAssetsCache(getHandler({strategy: 'cacheFirst', flag: 'swAssetCaching'}));

import polyfillCache from './caches/polyfill';
// use fastest caching strategy as we want to send requests to
// check last-modified headers for polyfill
polyfillCache(getHandler({strategy: 'fastest', flag: 'swAssetCaching'}));


// import commentsCache from './caches/comments';
// commentsCache(getHandler({strategy: 'cacheFirst', flag: 'swCommentsAssets'}));

// user-specific things
// import myFtCache from './caches/myft';
// myFtCache(getHandler({strategy: 'cacheFirst', flag: 'swMyftCaching'}));

import adsCache from './caches/ads';
adsCache(getHandler({ flag: 'swAdsCaching', strategy: 'cacheFirst' }));

import './push/myft';

self.addEventListener('fetch', ev => {
	const handler = router.match(ev.request);
	if (handler) {
		ev.respondWith(handler(ev.request));
	}
});

self.addEventListener('activate', ev => {
	ev.waitUntil(self.clients.claim());
	cache.deleteOldCaches(caches);
});

self.addEventListener('message', messageHandler);
