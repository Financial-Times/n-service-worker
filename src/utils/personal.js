import toolbox from 'sw-toolbox';

import cache from './cache';

const options = {
	origin: self.registration.scope.replace(/\/$/, '')
};

const personalCaches = new Set();

const registerCache = name => personalCaches.add(name);

const clearCaches = () =>
	Promise.all(
		Array.from(personalCaches)
			.map(name => cache(name.replace('next:', '')).then(cache => cache.clear()))
	);

const clearAndFetch = request =>
	clearCaches()
		.then(() => fetch(request))
		.catch(() => fetch(request));

toolbox.router.get('/logout', clearAndFetch, options);
// clear on edition switching
toolbox.router.get('/international', clearAndFetch, options);
toolbox.router.get('/uk', clearAndFetch, options);

export { clearCaches, registerCache }
