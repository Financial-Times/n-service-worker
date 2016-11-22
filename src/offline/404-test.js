import router from '../utils/router';

import cache from '../utils/cache';
import precache from '../utils/precache';
import * as _url from 'url';
import { getHandler } from '../utils/handlers';
import { getFlag } from '../utils/flags'

const cacheOptions = {
	name: 'offline-ft'
};

// precache the landing page + its link headers
precache(
	cacheOptions.name,
	[
		new Request('https://local.ft.com:5050/__offline/landing', {
			credentials: 'same-origin',
			mode: 'cors'
		})
	],
	{ maxAge: 60 * 60 * 2, followLinks: true } // follow and cache Link header
);

/*
Only respond with landing page if:
  - Request method is 'GET'
  - Request accepts 'text/html'
  - protocol is 'https:''
  - hostname matches: 'www.ft.com' or 'local.ft.com'
  - path does not start with '/__'
  - Flag 'offlineLandingTestPage' is truthy
*/
const isHtmlRequest = (req) => {
	const urlObj = _url.parse(req.url);
	return req.method === 'GET' && req.headers.get('accept').includes('text/html') && urlObj.protocol === 'https:' && /(local|www)(\.ft\.com)/.test(urlObj.hostname) && !/(^\/\_\_)/.test(urlObj.pathname) && getFlag('offlineLandingTestPage');
}

// try our cache then network & save
const flaggedCacheFirst = getHandler({strategy: 'cacheFirst', flag: 'offlineLandingTestPage', upgradeToCors: true});

/*
ALL requests on https://www.ft.com or https://local.ft.com
flagged cache -> network & save -> fallback to landing page
*/
router.get('/(.*)', (request, values, options) => {
	return flaggedCacheFirst(request, values, options).catch(err => {
		// cache & network fail
		if (isHtmlRequest(request)) {
			// serve landing page from precache
			return cache(options.cache.name)
					.then(cache => cache.get('/__offline/landing'));
		}
		throw err;
	});
}, {
	origin: /^https\:\/\/(local|www)(\.ft\.com)/,
	cache: cacheOptions
});

/*
ALL requests on ALL origins
flagged cache -> network & save
TODO: mount on '/__offline/' which will act as a proxy
*/
router.get('/(.*)', flaggedCacheFirst, {
	origin: /[\s\S]*/, // match all origins
	cache: cacheOptions
});
