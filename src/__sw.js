const cacheName = 'static-assets-v1';
const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'];
const fontsVersion = '1.3.0';
const cssFile = /^https?:\/\/[^\.]*\.ft\.com\/(.*)\/main(-.+)?\.css$/;
const fontFile = /^https?:\/\/next-geebee\.ft\.com\/build\/v2\/files\/o-fonts-assets/;

const isCssRequest = request => cssFile.test(request.url);

const isFontRequest = request => fontFile.test(request.url);

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(cacheName)
			.then(cache =>
				cache.addAll(
					fonts.map(font => `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@${fontsVersion}/${font}.woff?`)
				)
			)
	);
});

self.addEventListener('activate', () => { });

self.addEventListener('fetch', event => {
	// If this is a request for our main CSS file
	if (isCssRequest(event.request)) {
		// Respond with cached copy or fetch new version
		event.respondWith(
			caches.match(event.request)
				.then(response => {
					if (response) {
						return response;
					}

					return fetch(event.request.clone())
						.then(response => {
							if (response && response.status === 200 && response.type === 'basic') {
								caches.open(cacheName)
									.then(cache => cache.put(event.request, response.clone()));
							}

							return response;
						});
				})
		);
	}

	if (isFontRequest(event.request)) {
		event.respondWith(
			caches.match(event.request)
				.then(response => response || fetch(event.request))
		);
	}
});
