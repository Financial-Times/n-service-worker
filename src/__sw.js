import toolbox from 'sw-toolbox';
toolbox.options.cache.name = 'next';

import './utils/flags';

// generic assets
import './lib/fonts';
import './lib/image';
import './lib/built-assets';
import './lib/n-ui';
import './lib/polyfill';
import './lib/comments';

// user-specific things
// import './lib/content';
import './lib/session';
import './lib/myft';
import './lib/ads';

toolbox.options.cache.name = 'next';
