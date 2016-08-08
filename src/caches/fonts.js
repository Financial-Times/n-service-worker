import toolbox from 'sw-toolbox';

import { cacheFirstFlagged } from '../utils/handlers';
import precache from '../utils/precache';

const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';
const options = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: `fonts:${fontsVersion}`,
		maxEntries: 5
	}
};

precache(
	options.cache.name,
	fonts.map(font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${fontsVersion}/${font}.woff?`),
	{ maxAge: -1, maxEntries: options.cache.maxEntries }
);

// fonts route
toolbox.router.get('/build/v2/files/o-fonts-assets@:version/:font.woff', cacheFirstFlagged, options);
