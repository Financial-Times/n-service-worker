// import './utils/navigate';

import './utils/flags';

// generic assets
import './caches/fonts';
import './caches/image';
import './caches/built-assets';
import './caches/polyfill';
// import './caches/comments'; *

// user-specific things
// import './caches/myft';
import './caches/ads';

import './push/myft';

import router from './utils/router';
import { messageHandler } from './messages';
const cache = require('./utils/cache');

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
