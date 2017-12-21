import Db from './db';

function addHeadersToResponse (res, headers) {
	const response = res.clone();
	const originalHeaders = {};

	response.headers.forEach((v,k) => {
		originalHeaders[k] = v;
	});

	const init = {
		status: response.status,
		statusText: response.statusText,
		headers: Object.assign({}, originalHeaders, headers)
	};

	return response.text()
		.then(body => {
			return new Response(body, init);
		});
}

class Cache {

	/**
	 * @param {object} cache - Native Cache object
	 * @param {string} cacheName - Name of the cache
	 */
	constructor (cache, cacheName) {
		this.cache = cache;
		this.db = new Db('requests', { dbName: cacheName });
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
	set (request, { response, type = null, maxAge = 60, maxEntries } = { }) {

		const fetchRequest = response ? Promise.resolve(response) : fetch(request);
		return fetchRequest
			.then(fetchedResponse => {
				if (fetchedResponse.ok || fetchedResponse.type === 'opaque') {
					const url = typeof request === 'string' ? request : request.url;

					let cacheMeta = {
						cached_ts: Date.now(),
						type,
						etag: fetchedResponse.headers.get('etag')
					};

					if (maxAge !== -1) cacheMeta.expires = Date.now() + (maxAge * 1000);

					const respondWith = Promise.all([
						this.cache.put(request, fetchedResponse.clone()),
						maxAge !== -1 ? this.db.set(url, cacheMeta) : null
					])
						.then(() => fetchedResponse);

					// we use setTimeout as this isn't important enough to be put immediately on the microtask queue
					setTimeout(() => respondWith
						.then(() => {
							if (maxEntries) {
								this.limit(maxEntries);
							}
						}));

					return respondWith;
				} else {
					return fetchedResponse;
				}
			});
	}

	/**
	 * Given a URL or Request object, retrieve the Response from the cache
	 *
	 * @param {string|object} - Either a URL or a Request object
	 * @returns {object|undefined} - The Response, or undefined if nothing in the cache
	 */
	get (request, debug) {

		return this.expire(request)
			.then(({ expiryDate, noExpiry } = { }) => {
				if (!expiryDate && !noExpiry) {
					return;
				}
				return this.cache.match(request)
					.then(response => {
						if (!response) {
							// TODO maybe call this.delete here too
							return;
						}
						if (debug === true || (response.type !== 'opaque' && request.headers && request.headers.get('FT-Debug'))) {
							return addHeadersToResponse(response, {
								'From-Cache': 'true',
								expires: expiryDate || 'no-expiry'
							});
						} else {
							return response;
						}
					});
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
			.then(() => undefined);
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
		return this.cache.keys();
	}

	expireAll () {
		return this.cache.keys()
			.then(keys => Promise.all(keys.map(this.expire.bind(this))));
	}

	expire (key) {
		const url = typeof key === 'string' ? key : key.url;
		return this.db.get(url)
			.then(({ expires } = { }) => {
				if (expires && expires <= Date.now()) {
					return this.delete(key);
				}
				return { expiryDate: expires, noExpiry: !expires };
			});
	}

	/**
	 * Limit the number of items in the cache
	 */
	limit (count) {
		return this.keys()
			.then(keys =>
				Promise.all(
					keys
						.map(key =>
							this.db.get(key.url)
								.then(({expires} = {}) => ({key, expires}))
						)
				)
					.then(lookups =>
						lookups
							.sort((i1, i2) => {
								return i1.expires > i2.expires ? -1 : i1.expires < i2.expires ? 1 : 0;
							})
							.slice(count)
							.map(({key}) => this.delete(key))
					)
			);
		// .then(keys => Promise.all(keys.reverse().slice(count).map(this.delete.bind(this))));
	}
}

/**
 * @param {string} - Name of the cache
 * @param {object} [opts]
 * @param {string} [opts.cacheNamePrefix = 'next'] - What to prefix to the cache name
 * @returns Cache
 */
function CacheWrapper (cacheName, { cacheNamePrefix = 'next' } = { }) {
	const fullCacheName = `${cacheNamePrefix}:${cacheName}`;
	return caches.open(fullCacheName)
		.then(cache => {
			return new Cache(cache, fullCacheName);
		});
}

function checkAndExpireAllCaches (caches) {
	return caches.keys().then(keys => {
		keys.map(cacheName => caches.open(cacheName).then(cache => {
			const cc = new Cache(cache, cacheName);
			cc.expireAll();
		}));
	});
}

function deleteOldCaches (caches) {
	// Delete any unversioned caches.
	[
		'next:ads',
		'next:ads:personal',
		'next:built-assets',
		'next:comments',
		'next:fonts',
		'next:image',
		'next:myft',
		'next:polyfill',
		'next:session',
	].forEach(cache => {
		indexedDB.deleteDatabase(cache);
		caches.delete(cache);
	});
}

module.exports = {
	CacheWrapper,
	checkAndExpireAllCaches,
	deleteOldCaches
};
