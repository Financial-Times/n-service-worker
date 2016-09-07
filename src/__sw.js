// import './utils/navigate';
self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'claim') {
		self.clients.claim();
		ev.ports[0].postMessage('claimed')
	}
});


import toolbox from 'sw-toolbox';
toolbox.options.cache.name = 'next';
toolbox.options.successResponses = /^200$/;

import './utils/flags';

// generic assets
import './caches/fonts';
// import './caches/image';
// import './caches/built-assets';
// import './caches/n-ui';
// import './caches/polyfill';
// import './caches/comments';

// user-specific things
// import './offline/content';
// import './caches/session';
// import './caches/myft';
// import './caches/ads';


// import './push/myft';
