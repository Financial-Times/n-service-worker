import Db from './db';
import parseLinkHeader from './parse-link-headers';
import lowResImage from './low-res-image';
import offlineContent from './offline-content';

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
	 * @param {string|boolean} [opts.followLinks] - cache items found in link header, see followLinkHeader()
	 * @returns {object} - The Response
	 */
	set (request, { response, type = null, maxAge = 60, maxEntries, followLinks = false } = { }) {

		const fetchRequest = response ? Promise.resolve(response) : fetch(request);
		return fetchRequest
			.then(fetchedResponse => {
					return this.followLinkHeader(request, fetchedResponse, { maxAge, maxEntries, followLinks });
				})
			.then(fetchedResponse => {
				if (fetchedResponse.ok || fetchedResponse.type === 'opaque') {
					const url = typeof request === 'string' ? request : request.url;

					let cacheMeta = {
						cached_ts: Date.now(),
						type,
						etag: fetchedResponse.headers.get('etag')
					}

					if (maxAge !== -1) cacheMeta.expires = Date.now() + (maxAge * 1000)

					const respondWith = Promise.all([
						this.cache.put(request, fetchedResponse.clone()),
						maxAge !== -1 ? this.db.set(url, cacheMeta) : null
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
			.then(({response, expires} = {}) => {
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
				return {response, expires}
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
			)
			// .then(keys => Promise.all(keys.reverse().slice(count).map(this.delete.bind(this))));
	}

	/**
	 * Follow Link header - cache urls in link header with rel=precache
	 * will attempt to cache low res version of image requests
	 * and "offline" versions of content pages
	 * @param {objcet} [fetchedResponse] - Response object
	 * @param {object} [opts] - the cache.set options, see set()
	 * @param {string|boolean} [opts.followLinks] - cache items found in link header:
	 * - true = recursively follow link headers
	 * - false = default, do not follow
	 * @returns {object} - The fetchedResponse
	 */
	followLinkHeader (request, fetchedResponse, { maxAge, maxEntries, followLinks = false } = {}) {
		let links = fetchedResponse.headers.get('link');

		if (!links || followLinks === false) {
			// abort, do not follow
			return Promise.resolve(fetchedResponse);
		} else {
			return this.db.get(request.url)
				.then(cacheMeta => {

					// check if we already have a cached version of resource
					if (cacheMeta && cacheMeta.etag && cacheMeta.etag === fetchedResponse.headers.get('etag')) {
						// abort, same as cached resource, do not follow
						throw new Error('no change from cached version');
					}

					return parseLinkHeader(links);
				})
				.then(parsedLinks => {
					if (parsedLinks && parsedLinks.length && parsedLinks.length === 0) {
						// abort, no link headers to follow
						throw new Error('no links to follow')
					}

					parsedLinks
						.filter(link => link.rel === 'precache') // TODO: pass as option
						.forEach(link => {
							let response;

							if (link.as === 'image') {
								// cache low res version of image
								const lowResImageUrl = lowResImage(link.url);
								response = fetch(lowResImageUrl)
							}

							if (link.as === 'document') {
								// cache offline version of content
								response = offlineContent(link.url);
							}

							// cache request
							const _req = new Request(link.url, {
								credentials: 'same-origin', // TODO: set based on original?
								mode: 'cors' // matches requests as we use upgradeToCors
							});

							this.set(_req, { response, type: link.as, maxAge, maxEntries, followLinks });
						});

				})
				.then(() => Promise.resolve(fetchedResponse))
				.catch(() => Promise.resolve(fetchedResponse))
		}

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
		});
}
