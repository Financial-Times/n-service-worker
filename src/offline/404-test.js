import router from '../utils/router';

const options = {
	origin: self.registration.scope.replace(/\/$/, '')
};

// TODO: filter request so we only respond to desired requests
const showOfflineLandingPage = (req) => {
	return req.method === 'GET' && req.headers.get('accept').includes('text/html');
}

// catch all
// TODO: filter out routes
router.get('/(.*)', (request, values, options) => {

	// Attempt to return a response from the network
	return fetch(request, values, options).catch(error => {
		// If both the network fails, then `.catch()` will be triggered,
		// and we get a chance to respond with our cached fallback page.

		if (showOfflineLandingPage(request)) {

			// TODO: Trigger some tracking

			// respond with content
			// TODO: respond with cached version of the "landing" page
			return new Response('hello world', {
				headers: {'Content-type': 'application/json' }
			});

		}
		throw error;
	});

}, options);
