import router from '../utils/router';

import precache from '../utils/precache';
import * as _url from 'url';
import { getHandler } from '../utils/handlers';
import { getFlag } from '../utils/flags';

const cacheOptions = {
	name: 'offline-ft-v1'
};

let offlineLandingRequest

if (getFlag('offlineLandingTestPage')) {
	offlineLandingRequest = new Request ('/__offline/landing', {
		credentials: 'same-origin'
	});
} else {
	offlineLandingRequest = new Request ('/__offline/top-stories', {
		credentials: 'same-origin'
	});
}

// precache offlineLandingRequest response + its link headers
precache(
	cacheOptions.name,
	[ offlineLandingRequest ],
	{ maxAge: 60 * 60 * 2, followLinks: true } // follow and cache Link header
);

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
				&& !/(^\/\_\_)/.test(urlObj.pathname)
				&& getFlag('offlineLandingTestPage') );
}

// Find match in our cache
// NOTE: we use upgrade to cors as Link header caching uses cors mode
const corsCacheOnly = getHandler({strategy: 'cacheOnly', upgradeToCors: true})

/**
 * Catch All
 * network as-is -> (flag) -> cache as-cors -> (logic) -> precached landing page
 * throws network response error
 * TODO: Split into two routes:
 *  - mount assets on '/__offline/' which will act as a proxy
 *  - mount landing page on origin restricted catch all
 */
router.get('/(.*)', (request, values, options) => {
	return fetch(request).catch(resErr => {

		return corsCacheOnly(request, values, options).catch(() => {

			if (isHtmlRequest(request)) {
				return corsCacheOnly(offlineLandingRequest, values, options);
			}

			throw resErr;
		});

	});
}, {
	origin: /[\s\S]*/, // match all origins
	cache: cacheOptions
});
