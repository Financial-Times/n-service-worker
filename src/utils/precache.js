import cache from './cache';

const precachePromises = [];

// NOTE: not using sw toolbox's precache, as can't set the cache name
export default (name, urls, { maxAge, maxEntries, followLinks, type } = { }) => {
	self.addEventListener('install', ev => {
		const promise = Promise.all(
			urls.map(url =>
				cache(name)
					.then(cache => cache.set(url, { maxAge, maxEntries, followLinks, type }))
			)
		);
		precachePromises.push(promise);
		ev.waitUntil(promise);
	});
}

self.addEventListener('install', ev => {
	ev.waitUntil(
		Promise.all(precachePromises)
		.then(() => {
			return self.skipWaiting();
		})
	);
});
