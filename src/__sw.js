// import './utils/navigate';

import './utils/flags';

// generic assets
// import './caches/fonts';
// import './caches/image';
// import './caches/built-assets';
// import './caches/n-ui';
// import './caches/polyfill';
// import './caches/comments';
import './caches/offline-landing';

// user-specific things
// import './offline/content';
// import './caches/session';
// import './caches/myft';
// import './caches/ads';

import './offline/404-test';


// import './push/myft';


import router from './utils/router';

self.addEventListener('fetch', ev => {
	const handler = router.match(ev.request);
	if (handler) {
		ev.respondWith(handler(ev.request));
	}

});
