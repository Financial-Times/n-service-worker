import router from '../utils/router';

import cache from '../utils/cache';
import getUuid from '../utils/get-uuid';

// import './cache-content-message.js'

const options = {
	origin: self.registration.scope.replace(/\/$/, '')
};

router.get('/content/:uuid', request =>
	getUuid()
		.then(uuid =>
			uuid ?
				cache(`content:${uuid}`)
					.then(cache => cache.get(request))
					.then(response => response || fetch(request)) :
				fetch(request)
		),
options);
