import cache from './cache';
import { getFlag } from './flags';

function upgradeRequestToCors (request) {
	return new Request(request.url, {
		method: request.method,
		headers: request.headers,
		mode: 'cors', // need to set this properly
		credentials: request.credentials,
		redirect: 'manual'   // let browser handle redirects
	});
}

const basicHandlers = {
	cacheFirst: (request, values, options = {}) => {
		const cacheOptions = options.cache || {};

		return cache(cacheOptions.name)
			.then(cache => cache.getOrSet(request, cacheOptions))
			.catch(() => fetch(request));
	},

	fastest: (request, values, options = { }) => {
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

}

const getHandler = ({strategy, flag, upgradeToCors}) => {
	return (request, values, options = {}) => {
		if (flag && !getFlag(flag)) {
			return fetch(request);
		}
		if (upgradeToCors) {
			request = upgradeRequestToCors(request)
		}
		return basicHandlers[strategy](request, values, options);
	}
}

export { getHandler }
