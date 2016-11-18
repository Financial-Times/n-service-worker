import router from '../utils/router';

import { getHandler } from '../utils/handlers';
import { getFlag } from '../utils/flags'

// match origin: https://www.ft.com or https://local.ft.com
const options = {
	origin: /^https\:\/\/(local|www)(\.ft\.com)/
};

/*
Only respond with landing page if:
	- Request method is GET
	- Request accepts text/html
	- Flag `offlineLandingTestPage` is truthy
*/
const showOfflineLandingPage = (req) => {
	return req.method === 'GET' && req.headers.get('accept').includes('text/html') && getFlag('offlineLandingTestPage');
}

// don't do anything with asset paths: "/__[...]"
router.get('/__(.*)', getHandler({strategy: 'networkOnly'}), options);

// catch all
router.get('/(.*)', (request) => {

	// Attempt to return a response from the network
	return fetch(request).catch(error => {

		// network fail. respond with landing page?
		if (showOfflineLandingPage(request)) {
			// TODO: Trigger some tracking ?

			// respond with cached version of the "landing" page
			return caches.match('/__offline/landing');
		}

		throw error;
	});

}, options);
