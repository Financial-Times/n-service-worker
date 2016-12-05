import router from '../utils/router';
import { registerCache } from '../utils/personal';
import { cacheFirst } from '../utils/handlers';
import getUuid from '../utils/get-uuid';

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
