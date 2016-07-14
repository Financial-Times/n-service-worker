import toolbox from 'sw-toolbox';

const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';

// cache fronts upfront
toolbox.precache(
	fonts.map(font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${fontsVersion}/${font}.woff?`)
);

// fonts route
toolbox.router.get(
	'/build/v2/files/o-fonts-assets@:version/:font.woff', toolbox.cacheFirst, { origin: 'https://next-geebee.ft.com' }
);

// css route
toolbox.router.get('/hashed-assets/:appName/:assetHash/:cssName.css', toolbox.cacheFirst);
// local css
toolbox.router.get('/:appName/:cssName.css', toolbox.cacheFirst);

toolbox.router.get('/', toolbox.fastest);
