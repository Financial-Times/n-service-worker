import toolbox from 'sw-toolbox';

import * as fonts from '../utils/fonts';
import precache from '../utils/precache';

const options = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: fonts.cacheName,
		maxEntries: 5
	}
};

precache(fonts.names.map(font => fonts.buildUrl(font)), options);

// fonts route
toolbox.router.get(`/build/v2/files/o-fonts-assets@${fonts.version}/:font.woff`, toolbox.cacheFirst, options);

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'fonts:areCached') {
		Promise.all(
				msg.fonts.map(font =>
					caches.match(fonts.buildUrl(font), { cacheName: fonts.cacheName })
						.then(response => ({ [font]: !!response }))
						.catch(() => ({ [font]: false }))
				)
			)
			.then(fontsStatus => {
				const responseMsg = fontsStatus.reduce(
					(currentResponseMsg, fontStatus) => Object.assign({}, currentResponseMsg, fontStatus), { }
				);
				ev.ports[0].postMessage(responseMsg);
			});
	}
});
