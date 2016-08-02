const names = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const version = '1.3.0';
const cacheName = `next:fonts:${version}`;

const buildUrl = font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${version}/${font}.woff?`;

const areCached = (fonts = names) =>
	Promise.all(
			fonts.map(font =>
				caches.match(buildUrl(font), { cacheName })
					.then(response => !!response)
					.catch(() => false)
			)
		)
		.then(fontsStatus => !fontsStatus.some(fontStatus => !fontStatus));

export { names, version, cacheName, buildUrl, areCached }
