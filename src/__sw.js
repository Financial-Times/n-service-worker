const cacheName = 'static-assets';
const cssFile = /^https?:\/\/next-geebee\.ft\.com\/hashed-assets\/(.*)\/main-.*\.css/;
const fontFile = /^https?:\/\/next-geebee\.ft\.com\/build\/v2\/files\/o-fonts-assets/;

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(cacheName).then(cache =>
			cache.addAll([
				'https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.2.0/MetricWeb-Light.woff?',
				'https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.2.0/MetricWeb-Semibold.woff?',
				'https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.2.0/MetricWeb-LightItalic.woff?',
				'https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.2.0/FinancierDisplayWeb-LightItalic.woff?',
				'https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.2.0/FinancierDisplayWeb-MediumItalic.woff?'
			])
		)
	);
});

self.addEventListener('activate', () => {
	if (self.clients && clients.claim) {
		clients.claim();
	}
});

const isCssRequest = request => cssFile.test(request.url);

const isFontRequest = request => fontFile.test(request.url);

const getCssAppName = path => path.match(cssFile)[1];

self.addEventListener('fetch', event => {
	// If this is a request for our main CSS file
	if (isCssRequest(event.request)) {
		caches.open(cacheName).then(cache =>
			// Respond with cached copy or fetch new version
			event.respondWith(
				cache.match(event.request).then(response =>
					response || fetch(event.request).then(response => {
						// Was a new version so invalidate all old copies
						cache.keys().then(keys => {
							keys
								.filter(key => getCssAppName(key.url) === getCssAppName(event.request.url))
								.forEach(request => {
									cache.delete(request);
								});
						});
						// Cache new copy
						if (response.status === 200) {
							cache.put(event.request, response.clone());
						}

						return response;
					})
				)
			)
		);
	}

	if (isFontRequest(event.request)) {
		caches.open(cacheName).then(cache => {
			event.respondWith(
				cache.match(event.request).then(response => response || fetch(event.request))
			);
		});
	}
});
