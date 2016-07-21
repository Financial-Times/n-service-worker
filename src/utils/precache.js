import toolbox from 'sw-toolbox';

// NOTE: not using sw toolbox's precache, as can't set the cache name
export default (urls, options) => {
	self.addEventListener('install', ev => {
		ev.waitUntil(
			Promise.all(urls.map(url => toolbox.cache(url, options)))
		);
	});
}
