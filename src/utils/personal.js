import toolbox from 'sw-toolbox';

const personalCaches = new Set();

export function registerCache (name) {
	personalCaches.add(name)
}

function clearCaches (request) {
	Array.from(personalCaches)
		.forEach(name => caches.delete(name));
	return fetch(request);
}

toolbox.router.get('/logout', clearCaches, {
	origin: self.registration.scope.replace(/\/$/, '')
})
