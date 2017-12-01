import './utils/flags';

// generic assets
import fontsCache from './caches/fonts';
fontsCache(getHandler({strategy: 'cacheFirst', flag: 'swAssetCaching'}));

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

import router from './utils/router';
import { messageHandler } from './messages';
const cache = require('./utils/cache');
import { getHandler } from './utils/handlers';


self.addEventListener('fetch', ev => {
	const handler = router.match(ev.request);
	if (handler) {
		ev.respondWith(handler(ev.request));
	}
});

self.addEventListener('activate', ev => {
	ev.waitUntil(self.clients.claim());
});

// Cleanup caches on install
self.addEventListener('install', () => {
	cache.checkAndExpireAllCaches(caches)
		.then(() => {
			// Delete any unversioned caches.
			[
				'next:ads',
				'next:ads:personal',
				'next:built-assets',
				'next:comments',
				'next:fonts',
				'next:image',
				'next:myft',
				'next:polyfill',
				'next:session',
			].forEach(cache => {
				indexedDB.deleteDatabase(cache);
				caches.delete(cache);
			});
		});
});

self.addEventListener('message', messageHandler);
