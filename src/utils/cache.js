import Db from './db';

function addHeadersToResponse (res, headers) {
	const response = res.clone()
	const init = {
			status: response.status,
			statusText: response.statusText,
			headers
	};

	response.headers.forEach((v,k) => {
			init.headers[k] = v;
	});
	return response.text()
		.then(body => {
			return new Response(body, init);
		})
}

export class Cache {

	/**
	 * @param {object} cache - Native Cache object
	 * @param {string} cacheName - Name of the cache
	 */
	constructor (cache, cacheName) {
		this.cache = cache;
		this.db = new Db('requests', { dbName: cacheName })
	}

	/**
	 * Given a URL or Request object, fetch and store in the cache
	 *
	 * @param {string|object} - Either a URL or a Request object
	 * @param {object} [opts]
	 * @param {objcet} [opts.response] - Response object to cache; skips fetching
	 * @param {number} [opts.maxAge = 60] - Number of seconds to cache the response. -1 for no caching
	 * @param {number} [opts.maxEntries] - Max number of entries to keep in cache, defaults to 'infinite'
	 * @returns {object} - The Response
	 */
	set (request, { response, maxAge = 60, maxEntries } = { }) {

		const fetchRequest = response ? Promise.resolve(response) : fetch(request);
		return fetchRequest.then(fetchedResponse => {
			if (fetchedResponse.ok || fetchedResponse.type === 'opaque') {
				const url = typeof request === 'string' ? request : request.url;

				const respondWith = Promise.all([
					this.cache.put(request, fetchedResponse.clone()),
					maxAge !== -1 ? this.db.set(url, { expires: Date.now() + (maxAge * 1000) }) : null
				])
					.then(() => fetchedResponse)

				// we use setTimeout as this isn't important enough to be put immediately on the microtask queue
				setTimeout(() => respondWith
					.then(() => {
						if (maxEntries) {
							this.limit(maxEntries)
						}
					}))

				return respondWith;
			} else {
				return fetchedResponse;
			}
		})
	}

	/**
	 * Given a URL or Request object, retrieve the Response from the cache
	 *
	 * @param {string|object} - Either a URL or a Request object
	 * @returns {object|undefined} - The Response, or undefined if nothing in the cache
	 */
	get (request, debug) {

		return this.expire(request)
			.then(response => {
				if (!response) {
					return;
				}
				if (debug === true || (response.type !== 'opaque' && request.headers && request.headers.get('FT-Debug'))) {
					return addHeadersToResponse(response, {
						'From-Cache': 'true',
						expires: expires || 'no-expiry'
					})
				} else {
					return response;
				}
			});
	}

	/**
	 * Try and get the Request's Response from cache, else add it
	 *
	 * @param {string|object} - Either a URL or a Request object
	 * @param {object} [opts]
	 * @param {number} [opts.maxAge = 60] - Number of seconds to cache the response. -1 for no caching
	 * @param {number} [opts.maxEntries] - Max number of entries to keep in cache, defaults to 'infinite'
	 * @returns {object} - The Response
	 */
	getOrSet (request, { maxAge = 60, maxEntries } = { }) {
		return this.get(request)
			.then(response => response || this.set(request, { maxAge, maxEntries }))
	}

	/**
	 * Given a URL or Request object, delete the item from the cache
	 *
	 * @param {string|object} - Either a URL or a Request object
	 */
	delete (request) {
		const url = typeof request === 'string' ? request : request.url;
		return Promise.all([
			this.cache.delete(request),
			this.db.delete(url),
		])
		.then(() => { });
	}

	/**
	 * Delete everthing from this cache
	 */
	clear () {
		return this.cache.keys().then(keys =>
			Promise.all(keys.map(this.delete.bind(this)))
		);
	}

	/**
	 * Get all the keys in the cache (and remove expired ones in the process)
	 */
	keys () {
		return this.cache.keys()
	}

	expireAll () {
		return this.cache.keys()
			.then(keys => Promise.all(keys.map(this.expire.bind(this))));
	}

	expire (key) {
		const url = typeof key === 'string' ? key : key.url;
		return Promise.all([
			this.cache.match(key),
			this.db.get(url)
		])
			.then(([response, { expires } = { }]) => {
				if (expires && expires <= Date.now()) {
					return this.delete(key);
				}
				return response
			});
	}

	/**
	 * Limit the number of items in the cache
	 */
	limit (count) {
		return this.keys()
			.then(keys => Promise.all(keys.reverse().slice(count).map(this.delete.bind(this))));
	}

}

/**
 * @param {string} - Name of the cache
 * @param {object} [opts]
 * @param {string} [opts.cacheNamePrefix = 'next'] - What to prefix to the cache name
 * @returns Cache
 */
export default (cacheName, { cacheNamePrefix = 'next' } = { }) => {
	const fullCacheName = `${cacheNamePrefix}:${cacheName}`;
	return caches.open(fullCacheName)
		.then(cache => {
			const cacheWrapper = new Cache(cache, fullCacheName);
			cacheWrapper.expireAll();
			return cacheWrapper;

			// TODO: decide if this is necessary/desirable. It means a LOT of cache and db reading
			// clear out expired content (a side-effect of getting the keys)
			// return cacheWrapper.keys()
			// 	.then(() => cacheWrapper);
		});
}
