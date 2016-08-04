import Db from './db';

class Cache {

	/**
	 * @param {object} cache - Native Cache object
	 * @param {string} cacheName - Name of the cache
	 */
	constructor (cache, cacheName) {
		this.cache = cache;
		this.db = new Db('requests', { dbName: cacheName })
	}

	/**
	 * Given a URL or Request object, fetch the response and cache
	 *
	 * @param {string|object} - Either a URL or a Request object
	 * @param {object} [opts]
	 * @param {number} [opts.maxAge = 60] - Number of seconds to cache the response
	 * @returns {object} - The Response
	 */
	add (request, { maxAge = 60 } = { }) {
		return this.get(request)
			.then(cachedResponse => {
				if (cachedResponse) {
					return cachedResponse;
				} else {
					return fetch(request)
						.then(response => response.ok ? this.put(request, response, { maxAge }) : response)
				}
			});
	}

	/**
	 * Given a URL or Request object, and Response object, store in the cache
	 *
	 * @param {string|object} - Either a URL or a Request object
	 * @param {object} - Response object
	 * @param {object} [opts]
	 * @param {number} [opts.maxAge = 60] - Number of seconds to cache the response
	 * @returns {object} - The Response
	 */
	put (request, response, { maxAge = 60 } = { }) {
		return this.get(request)
			.then(cachedResponse => {
				if (cachedResponse) {
					return cachedResponse;
				} else {
					const url = typeof request === 'string' ? request : request.url;
					return Promise.all([
							this.cache.put(request, response.clone()),
							maxAge !== -1 ? this.db.set(url, { expires: Date.now() + (maxAge * 1000) }) : null
						])
							.then(() => response);

				}
			});
	}

	/**
	 * Given a URL or Request object, retrieve the Response from the cache
	 *
	 * @param {string|object} - Either a URL or a Request object
	 * @returns {object|undefined} - The Response, or undefined if nothing in the cache
	 */
	get (request) {
		const url = typeof request === 'string' ? request : request.url;
		return this.db.get(url)
			.then(({ expires } = { }) => {
				if (expires && expires <= Date.now()) {
					return this.delete(request);
				} else {
					return this.cache.match(request);
				}
			});
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
			return new Cache(cache, fullCacheName);
		});
}
