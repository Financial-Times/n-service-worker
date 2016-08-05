import cache from '../utils/cache';

// NOTE: not using sw toolbox's precache, as can't set the cache name
export default (urls, { name, maxAge, maxEntries } = { }) => {
	self.addEventListener('install', ev => {
		ev.waitUntil(
			Promise.all(
				urls.map(url =>
					cache(name.replace('next:', ''))
						.then(cache =>
							cache.set(url, { maxAge, maxEntries })
						)
				)
			)
		);
	});
}
