// import './utils/navigate';

// toolbox.options.cache.name = 'next';
// toolbox.options.successResponses = /^200$/;

import './utils/flags';

// generic assets
import './caches/fonts';
import './caches/image';
import './caches/built-assets';
import './caches/n-ui';
import './caches/polyfill';
import './caches/comments';

// user-specific things
// import './offline/content';
// import './caches/session';
// import './caches/myft';
import './caches/ads';


// import './push/myft';


import router from './utils/router';

self.addEventListener('fetch', function(event) {
  var handler = router.match(event.request);

  if (handler) {
    event.respondWith(handler(event.request));
  } else if (router.default && event.request.method === 'GET') {
    event.respondWith(router.default(event.request));
  }
});