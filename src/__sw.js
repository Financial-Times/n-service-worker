import toolbox from 'sw-toolbox';

const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';
// note because flags don't exist on first page view
// use flags typically to RETRIEVE from cache
// if flag === false can clear cache
// if flag === undefined can put in cache but not retrieve
// if flag === true can put and retrieve from cache
let flags = {}; //eslint-disable-line

self.addEventListener('message', msg => {
	const data = msg.data;
	switch (data.type) {
		case 'flagsUpdate' :
			flags = Object.freeze(data.flags);
			break;
	}
});

self.addEventListener('activate', () => {
	// do some stuff to enable/disable caches and other features based on value of current flags
});

// TODO need to version the fonts cache
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
