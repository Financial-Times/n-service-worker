import router from '../utils/router';;

import { getHandler } from '../utils/handlers';
import precache from '../utils/precache';

const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';
const options = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: 'fonts',
		maxEntries: 5
	}
};
// precache(
// 	options.cache.name,
// 	fonts.map(font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${fontsVersion}/${font}.woff?`),
// 	{ maxAge: -1, maxEntries: options.cache.maxEntries }
// );

// fonts route
router.get('/build/v2/files/o-fonts-assets@:version/:font.woff', getHandler({strategy: 'cacheFirst'}), options);
