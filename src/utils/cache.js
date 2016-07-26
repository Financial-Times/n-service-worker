import toolbox from 'sw-toolbox';

// NOTE: not using sw toolbox's cache, as can't set the cache max age
export default (url, options) => {
	// NOTE: bit nasty this, normal `toolbox.cache` doesn't use the `maxAgeSeconds` cache setting,
	// so indirectly do it through the `networkFirst` strategy
	return toolbox.networkFirst(new Request(url), null, options)
}
