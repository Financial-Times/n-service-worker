import cache from './cache';
import { getFlag } from './flags';

const cacheFirst = (request, values, options = { }) => {
	const cacheOptions = options.cache || { };

	return cache(cacheOptions)
		.then(cache => cache.getOrSet(request))
		.catch(() => fetch(request));
};

const cacheFirstFlagged = flagName => getFlag(flagName) ? cacheFirst : request => fetch(request);

const fastest = (request, values, options = { }) => {
	const cacheOptions = options.cache || { };

	return new Promise((resolve, reject) => {
		let rejected = false;

		const maybeReject = () => {
			if (rejected) {
				reject(new Error('Both cache and network failed'));
			} else {
				rejected = true;
			}
		};

		const maybeResolve = result => {
			if (result instanceof Response) {
				resolve(result);
			} else {
				maybeReject('No result returned');
			}
		};
		const requestCache = cache(cacheOptions.name)
		requestCache
			.then(cache => {
				fetch(request.clone())
					.then(response => cache.set(request, Object.assign({ }, cacheOptions, { response })))
					.then(maybeResolve)
					.catch(maybeReject);
				cache.get(request)
					.then(maybeResolve)
					.catch(maybeReject);
			})
	});
}

export { cacheFirst, cacheFirstFlagged, fastest }
