import toolbox from 'sw-toolbox';
toolbox.options.cache.name = 'next';

import './utils/flags';

// generic assets
import './caches/fonts';
import './caches/image';
import './caches/built-assets';
import './caches/n-ui';
import './caches/polyfill';
import './caches/comments';

// user-specific things
import './offline/content';
import './caches/session';
import './caches/myft';
import './caches/ads';


// import './push/myft';
