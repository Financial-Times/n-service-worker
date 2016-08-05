import toolbox from 'sw-toolbox';

import cache from './cache';

const personalCaches = new Set();

const registerCache = name => personalCaches.add(name);

const clearCaches = () =>
	Promise.all(
		Array.from(personalCaches)
			.map(name => cache(name.replace('next:', '')).then(cache => cache.clear()))
	);

toolbox.router.get('/logout', request =>
	clearCaches()
		.then(() => fetch(request))
		.catch(() => fetch(request)),
{ origin: self.registration.scope.replace(/\/$/, '') }
)

export { clearCaches, registerCache }
