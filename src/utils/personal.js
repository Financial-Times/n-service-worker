import toolbox from 'sw-toolbox';

const personalCaches = new Set();

export function registerCache (name) {
	personalCaches.add(name)
}

function clearCaches () {
	Array.from(personalCaches)
		.forEach(name => caches.delete(name))
}

toolbox.router.get('/logout', clearCaches, {
	// origin: 'https://*.ft.com'
})
