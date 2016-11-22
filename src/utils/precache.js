import cache from './cache';

// NOTE: not using sw toolbox's precache, as can't set the cache name
export default (name, urls, { maxAge, maxEntries, followLinks } = { }) => {
	self.addEventListener('install', ev => {
		ev.waitUntil(
			Promise.all(
				urls.map(url =>
					cache(name)
						.then(cache => cache.set(url, { maxAge, maxEntries, followLinks }))
				)
			)
		);
	});
}
