const cache = require('./cache').CacheWrapper;

const precachePromises = [];

// NOTE: not using sw toolbox's precache, as can't set the cache name
export default (name, urls, { maxAge, maxEntries, followLinks, type } = {}, { isOptional } = {}) => {
	self.addEventListener('install', ev => {
		const promise = Promise.all(
			urls.map(url =>
				cache(name)
					.then(cache => cache.set(url, { maxAge, maxEntries, followLinks, type }))
			)
		)
			.catch(err => isOptional ? Promise.resolve() : Promise.reject(err));

		precachePromises.push(promise);
		ev.waitUntil(promise);
	});
};

self.addEventListener('install', ev => {
	ev.waitUntil(
		Promise.all(precachePromises)
			.then(() => {
				return self.skipWaiting();
			})
	);
});
