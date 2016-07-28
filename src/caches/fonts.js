import toolbox from 'sw-toolbox';

const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';
const cacheOptions = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: `next:fonts:${fontsVersion}`,
		maxEntries: 5
	}
};

toolbox.precache(
	fonts.map(font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${fontsVersion}/${font}.woff?`),
	cacheOptions
);

// fonts route
toolbox.router.get('/build/v2/files/o-fonts-assets@:version/:font.woff', toolbox.cacheFirst, cacheOptions);
