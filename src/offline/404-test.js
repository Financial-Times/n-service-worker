import router from '../utils/router';
import { broadcast } from '../messages';

import precache from '../utils/precache';
import cache from '../utils/cache';
import * as _url from 'url';
import { getHandler } from '../utils/handlers';
import { getFlag } from '../utils/flags';

const cacheOptions = {
	name: 'offline-ft-v1',
	settings: { maxAge: 60 * 60 * 2, followLinks: true, type: 'document' } // follow and cache Link header
};

const offlineLanding404Request = new Request ('/__offline/landing', {
	credentials: 'same-origin',
	headers: {
		'x-requested-with': 'ft-sw'
	}
});

const offlineTopStoriesRequest = new Request ('/__offline/top-stories', {
	credentials: 'same-origin',
	headers: {
		'x-requested-with': 'ft-sw'
	}
});

let landingPage = getFlag('offlineLandingTestPage') ? offlineLanding404Request : offlineTopStoriesRequest;

// precache offlineLandingRequest response + its link headers on 'install'
precache(
	cacheOptions.name,
	[ landingPage ],
	cacheOptions.settings
);

// listen for flagUpdate events
self.addEventListener('message', (ev) => {
	const d = ev.data;
	if (d.type && d.type === 'flagsUpdate') {

		const req = d.flags && d.flags.offlineLandingTestPage ? offlineLanding404Request : offlineTopStoriesRequest;

		/**
		 * If new request is different from current landingPage then cache
		 * the new landingPage request and update landingPage reference
		 */
		if (req !== landingPage) {
			cache(cacheOptions.name)
				.then(cache => cache.set(req, cacheOptions.settings))
				.then(() => landingPage = req);
		}
	}
});


self.addEventListener('message', (ev) => {
	const d = ev.data;
	if (d.type && d.type === 'updateCache') {

		// on refresh message update the cache
		cache(cacheOptions.name)
			.then(cache => cache.set(landingPage, cacheOptions.settings));
	}

});

/**
 * Only respond with landing page if:
 *  - Request method is 'GET'
 *  - Request accepts 'text/html'
 *  - protocol is 'https:''
 *  - hostname matches: 'www.ft.com' or 'local.ft.com'
 *  - path does not start with '/__'
 *  - Flag 'offlineLandingTestPage' is truthy
 * TODO: utilise req.mode==='navigate'- support Chrome 49+ (sw is Chrome 40/42+)
 */
const isHtmlRequest = (req) => {
	const urlObj = _url.parse(req.url);
	return ( req.method === 'GET'
				&& req.headers.get('accept').includes('text/html')
				&& urlObj.protocol === 'https:'
				&& /(local|www)(\.ft\.com)/.test(urlObj.hostname)
				&& !/(^\/\_\_)/.test(urlObj.pathname));
}

// Find match in our cache
// NOTE: we use upgrade to cors as Link header caching uses cors mode
const corsCacheOnly = getHandler({strategy: 'cacheOnly', upgradeToCors: true});

function networkThenCache (request, values, options) {
	return fetch(request).catch(() => corsCacheOnly(request, values, options));
}

function cacheThenNetwork (request, values, options) {
	return corsCacheOnly(request, values, options).catch(() => fetch(request));
}

/**
 * Catch All
 * network as-is -> (flag) -> cache as-cors -> (logic) -> precached landing page
 * throws network response error
 * TODO: Split into two routes:
 *  - mount assets on '/__offline/' which will act as a proxy
 *  - mount landing page on origin restricted catch all
 */
router.get('/(.*)', (request, values, options) => {
	let req;

	if(navigator.onLine) {
		req = networkThenCache(request, values, options);
	} else {
		req = cacheThenNetwork(request, values, options);
	}

	return req.catch((err) => {
		if (isHtmlRequest(request)) {
			broadcast('offlineLanding', { target: request.url });
			return corsCacheOnly(landingPage, values, options);
		}
		throw err;
	});
}, {
	origin: /[\s\S]*/, // match all origins
	cache: cacheOptions
});
