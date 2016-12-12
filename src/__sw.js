// import './utils/navigate';

import './utils/flags';

// generic assets
import './caches/fonts';
import './caches/image';
// import './caches/built-assets';
// import './caches/n-ui';
// import './caches/polyfill';
// import './caches/comments'; *

// user-specific things
import './offline/content';
// import './offline/front-page';
// import './caches/session';
// import './caches/myft';
// import './caches/ads'; *
// import './push/myft';

// NOTE: this is mounted last as it
// contains a catch all route handler
// imports labelled with * have been disabled
// while we do MVP testing
import './offline/404-test';

import router from './utils/router';

self.addEventListener('fetch', ev => {
	const handler = router.match(ev.request);
	if (handler) {
		ev.respondWith(handler(ev.request));
	}
});
