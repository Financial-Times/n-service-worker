var cacheName = 'static-assets';
var cssFile = /^https?:\/\/next-geebee\.ft\.com\/hashed-assets\/.*\/main-.*\.css/;
var fontFile = /^https?:\/\/next-geebee\.ft\.com\/build\/files\/o-fonts-assets/;

self.addEventListener('install',function(event) {
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll([
				'https://next-geebee.ft.com/build/files/o-fonts-assets@1.2.0/MetricWeb-Light.woff?',
				'https://next-geebee.ft.com/build/files/o-fonts-assets@1.2.0/MetricWeb-Semibold.woff?',
				'https://next-geebee.ft.com/build/files/o-fonts-assets@1.2.0/MetricWeb-LightItalic.woff?',
				'https://next-geebee.ft.com/build/files/o-fonts-assets@1.2.0/FinancierDisplayWeb-LightItalic.woff?',
				'https://next-geebee.ft.com/build/files/o-fonts-assets@1.2.0/FinancierDisplayWeb-MediumItalic.woff?'
			]);
		})
	);
});

self.addEventListener('activate', function(event) {
	if (self.clients && clients.claim) {
		clients.claim();
	}
});

function isMainCssRequest(request) {
	return cssFile.test(request.url);
}

function isMainFontRequest(request) {
	return fontFile.test(request.url);
}

self.addEventListener('fetch', function(event) {
	// If this is a request for our main CSS file
	if (isMainCssRequest(event.request)) {
		caches.open(cacheName).then(function(cache) {
			// Respond with cached copy or fetch new version
			event.respondWith(
				cache.match(event.request).then(function(response) {
					return response || fetch(event.request).then(function(response) {
						// Was a new version so invalidate all old copies
						cache.keys().then(function(keys) {
							keys.filter(isMainCssRequest).forEach(function(request) {
								cache.delete(request);
							});
						});
						// Cache new copy
						if(response.status === 200) {
							cache.put(event.request, response.clone());
						}
						return response;
					});
				})
			);
		});
	}

	if(isMainFontRequest(event.request)) {
		caches.open(cacheName).then(function(cache) {
			event.respondWith(
				cache.match(event.request).then(function(response) {
					return response || fetch(event.request).then(function(response) {
						return response;
					});
				})
			);
		});
	}
});
