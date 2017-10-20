import cache from './cache';
import { getFlag } from './flags';
const ratRace = require('promise-rat-race');

function upgradeRequestToCors (request) {
	return new Request(request.url, {
		method: request.method,
		headers: request.headers,
		mode: 'cors', // need to set this properly
		credentials: request.credentials,
		redirect: 'manual'   // let browser handle redirects
	});
}

const wrappedFetch = (request, options = {}) => fetch(request).catch(err => options.isOptional 
	? Promise.resolve()
	: Promise.reject(err)
);

const handlers = {
	cacheFirst: (request, values, options = {}) => {
		const cacheOptions = options.cache || {};
		return cache(cacheOptions.name)
			.then(cache => cache.getOrSet(request, cacheOptions))
			.catch(() => wrappedFetch(request));
	},

	cacheOnly: (request, values, options = {}) => {
		const cacheOptions = options.cache || {};
		return cache(cacheOptions.name)
			.then(cache => cache.get(request, cacheOptions))
			.then(res => {
				if (!res && !options.isOptional) {
					throw 'request not found in cache';
				}
				return res;
			});
	},

	fastest: (request, values, options = { }) => {
		const cacheOptions = options.cache || { };
		const openCache = cache(cacheOptions.name);


		// kickoff retrieving response from network and cache
		const fromNetwork = wrappedFetch(request);
		const fromCache = openCache
			.then(cache => cache.get(request, cacheOptions))
			.then(res => {
				if (!res && !options.isOptional) {
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
			.then(([response, cache]) => cache.set(request, Object.assign({response: response.clone()}, cacheOptions)));

		// return a race between the two strategies
		return ratRace([
			fromNetwork.then(res => res.clone()),
			fromCache
		]);
	}
};

const getHandler = ({strategy, flag, upgradeToCors}) => {
	return (request, values, options = {}) => {
		if (flag && !getFlag(flag)) {
			return wrappedFetch(request);
		}
		if (upgradeToCors) {
			request = upgradeRequestToCors(request);
		}
		return handlers[strategy](request, values, options);
	};
};

export { getHandler };
