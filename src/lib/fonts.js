import toolbox from 'sw-toolbox';

const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';
const cacheOptions = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: `next:fonts:${fontsVersion}`
	}
};

// TODO need to version the fonts cache
// cache fronts upfront
toolbox.precache(
	fonts.map(font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${fontsVersion}/${font}.woff?`)
);

// fonts route
toolbox.router.get('/build/v2/files/o-fonts-assets@:version/:font.woff', toolbox.cacheFirst, cacheOptions);
