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
	cache.deleteOldCaches(caches);
});

self.addEventListener('message', messageHandler);
