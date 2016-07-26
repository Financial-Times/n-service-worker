import toolbox from 'sw-toolbox';
import {cacheFirst} from '../utils/flagged-toolbox';
import {get as getFlag} from '../utils/flags';
import {registerCache} from '../utils/personal';

function getCacheOptions (days, isPersonal) {
	return {
		name: 'next:ads' + (isPersonal ? ':personal' : ''),
		maxAgeSeconds: 60 * 60 * 24 * (days >= 1 ? days : (1/24)),
		maxEntries: 60
	}
}

registerCache('next:ads:personal');

// very similar to cacheFirst (on which it's based), but allows for differnt cache length for special reports
// TODO abstract this pattern out to somewhere
function conceptCache(request) {
	if (!getFlag('swAdsCaching')) {
		return fetch(request);
	}
	return caches.open('next:ads')
		.then(cache => cache.match(request))
		.then(response => {

			if (response) {
				return response;
			}

			return fetch(request.clone())
				.then(response => {
					if (request.method === 'GET' && toolbox.options.successResponses.test(response.status)) {
						caches.open('next:ads')
							.then(cache => cache.put(request, response))
							.then(() => response.clone().json())
							.then(data => {
									if (data.taxonomy === 'specialReports') {
										queueCacheExpiration(request, cache, getCacheOptions(0));
									} else {
										queueCacheExpiration(request, cache, getCacheOptions(7));
									}
							});
					}

					return response.clone();
				});
		});
}

toolbox.router.get('/v1/user', cacheFirst('swAdsCaching'), {
	origin: 'https://ads-api.ft.com',
	cache: getCacheOptions(7, true)
});

toolbox.router.get('/v1/concept', conceptCache, {
	origin: 'https://ads-api.ft.com'
});

toolbox.router.get('/tag/js/gpt.js', cacheFirst('swAdsCaching'), {
	origin: 'https://www.googletagservices.com',
	cache: getCacheOptions(7)
});

toolbox.router.get('/gpt/pubads_impl_*.js', cacheFirst('swAdsCaching'), {
	origin: 'https://partner.googleadservices.com',
	cache: getCacheOptions(30)
});

toolbox.router.get('/pagead/osd.js', cacheFirst('swAdsCaching'), {
	origin: 'https://pagead2.googlesyndication.com',
	cache: getCacheOptions(1)
});

toolbox.router.get('/safeframe/1-0-4/html/container.html', cacheFirst('swAdsCaching'), {
	origin: 'https://tpc.googlesyndication.com',
	cache: getCacheOptions(0)
});

toolbox.router.get('/userdata/*', cacheFirst('swAdsCaching'), {
	origin: 'https://cdn.krxd.net',
	cache: getCacheOptions(1, true)
});

toolbox.router.get('/controltag', cacheFirst('swAdsCaching'), {
	origin: 'https://cdn.krxd.net',
	cache: getCacheOptions(7)
});

toolbox.router.get('/ctjs/controltag.js*', cacheFirst('swAdsCaching'), {
	origin: 'https://cdn.krxd.net',
	cache: getCacheOptions(30)
});
