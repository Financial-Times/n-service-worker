import Db from './db';

class Cache {

	constructor (cache, cacheName) {
		this.cache = cache;
		this.db = new Db('requests', { dbName: cacheName })
	}

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

	delete (request) {
		const url = typeof request === 'string' ? request : request.url;
		return Promise.all([
				this.cache.delete(request),
				this.db.delete(url),
			])
			.then(() => { });
	}

}

export default (cacheName, { cacheNamePrefix = 'next' } = { }) => {
	const fullCacheName = `${cacheNamePrefix}:${cacheName}`;
	return caches.open(fullCacheName)
		.then(cache => {
			return new Cache(cache, fullCacheName);
		});
}
