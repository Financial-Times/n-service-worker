import toolbox from 'sw-toolbox';

import precache from '../utils/precache';

const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';
const cacheOptions = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: `next:fonts:${fontsVersion}`,
		maxEntries: 5
	}
};

precache(
	cacheOptions.cache.name,
	fonts.map(font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${fontsVersion}/${font}.woff?`),
	{ maxAge: -1, maxEntries: cacheOptions.cache.maxEntries }
);

// fonts route
toolbox.router.get('/build/v2/files/o-fonts-assets@:version/:font.woff', toolbox.cacheFirst, cacheOptions);
