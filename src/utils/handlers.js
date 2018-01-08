const cache = require('./cache').CacheWrapper;
import { getFlag } from './flags';
const ratRace = require('promise-rat-race');

const handlers = {
	cacheFirst: (request, values, options = {}) => {
		const cacheOptions = options.cache || {};
		return cache(cacheOptions.name)
			.then(cache => cache.getOrSet(request, cacheOptions))
			.catch(() => fetch(request));
	},

	cacheOnly: (request, values, options = {}) => {
		const cacheOptions = options.cache || {};
		return cache(cacheOptions.name)
			.then(cache => cache.get(request, cacheOptions))
			.then(res => {
				if (!res) {
					throw 'request not found in cache';
				}
				return res;
			});
	},

	fastest: (request, values, options = {}) => {
		const cacheOptions = options.cache || {};
		const openCache = cache(cacheOptions.name);

		const start = Date.now();
		// kickoff retrieving response from network and cache
		const fromNetwork = fetch(request)
			.then(res => {
				return res;
			});

		const fromCache = openCache
			.then(cache => cache.get(request, cacheOptions))
			.then(res => {
				if (!res) {
					throw 'request not found in cache';
				}
				return res;
			});

		// update the cache when the network response returns
		// no need to wait for this before responding though, hence not returned or thened
		Promise.all([
			fromNetwork,
			openCache
		])
			.then(([response, cache]) => {
				return cache.set(request, Object.assign({ response: response.clone() }, cacheOptions))
			});

		// return a race between the two strategies
		return ratRace([
			fromNetwork.then(res => res.clone()),
			fromCache
		]);
	}
};

const getHandler = ({ strategy, flag }) => {
	return async (request, values, options = {}) => {
		if (flag) {
			let flagIsOn = false;
			try {
				flagIsOn = await getFlag(flag)
			} catch (e) {};

			if (!flagIsOn) {
				return fetch(request);
			}
		}

		return handlers[strategy](request, values, options);
	};
};

export { getHandler };
