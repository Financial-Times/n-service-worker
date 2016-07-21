import cache from '../utils/cache';

// NOTE: not using sw toolbox's precache, as can't set the cache name
export default (urls, options) => {
	self.addEventListener('install', ev => {
		ev.waitUntil(
			Promise.all(urls.map(url => cache(url, options)))
		);
	});
}
