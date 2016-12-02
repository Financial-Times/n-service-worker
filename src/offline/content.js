import router from '../utils/router';;

import cache from '../utils/cache';
import { registerCache } from '../utils/personal';
import { cacheFirst } from '../utils/handlers';
import getUuid from '../utils/get-uuid';

// import './cache-content-message.js'

const options = {
	origin: self.registration.scope.replace(/\/$/, '')
};

registerCache('next:front-page');

router.get('/', request =>
	// only cache if logged in
	// NOTE: using whether there's a uuid in the session store as a proxy for logged in-ness
	getUuid()
		.then(uuid =>
			uuid ? cacheFirst(request, null, { cache: { name: 'front-page' } }) : fetch(request)
		),
options);

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


