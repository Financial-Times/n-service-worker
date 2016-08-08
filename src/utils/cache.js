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
		const limit = maxEntries ? this.limit(maxEntries) : Promise.resolve();
		return limit
			.then(() => this.get(request))
			.then(cachedResponse => {
				if (cachedResponse) {
					return cachedResponse;
				} else {
					const fetchRequest = response ? Promise.resolve(response) : fetch(request);
					return fetchRequest.then(fetchedResponse => {
						if (fetchedResponse.ok) {
							const url = typeof request === 'string' ? request : request.url;
							// make sure we have space to cache the Response
							const makeRoom = maxEntries ? this.limit(maxEntries - 1) : Promise.resolve();
							return makeRoom
								.then(() =>
									Promise.all([
										this.cache.put(request, fetchedResponse.clone()),
										maxAge !== -1 ? this.db.set(url, { expires: Date.now() + (maxAge * 1000) }) : null
									])
								)
								.then(() => fetchedResponse);
						} else {
							return fetchedResponse;
						}
					})

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
			.then(response => response || this.set(request, { maxAge, maxEntries }));
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
		return this.cache.keys().then(keys =>
			Promise.all(keys.map(this.get.bind(this)))
				.then(responses =>
					// return the keys that have a response
					keys.filter((key, index) => responses[index])
				)
		);
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
			return new Cache(cache, fullCacheName);
		});
}
