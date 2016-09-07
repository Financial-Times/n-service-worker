import cache from './cache';
import { getFlag } from './flags';

const cacheFirst = (request, values, options = { }) => {
	const cacheOptions = options.cache || { };

	return cache(cacheOptions.name)
		.then(cache => cache.getOrSet(request, cacheOptions))
		.catch((err) => {
			return fetch(request)
		});
};

const cacheFirstFlagged = flagName =>
	(request, values, options) =>
		getFlag(flagName) ? cacheFirst(request, values, options) : fetch(request);

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
		const requestCache = cache(cacheOptions.name);
		requestCache
			.then(cache => {
				cache.set(request.clone(), cacheOptions)
					.then(maybeResolve)
					.catch(maybeReject);
				cache.get(request, cacheOptions)
					.then(maybeResolve)
					.catch(maybeReject);
			})
	});
}

export { cacheFirst, cacheFirstFlagged, fastest }
