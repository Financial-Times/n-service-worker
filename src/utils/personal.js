const sessionToken = null;
const personalCaches = [];

const getSessionToken (cookie) {
	return (/^.*FTSession=([^;]+).*$/.match(cookie) || [])[1];
}

self.on('fetch', ev => {
	// if a request on ft.com
	if (/^https:\/\/(www|next)\.ft\.com/.test(ev.request.url)) {
		const cookie = ev.request.headers.get('cookie');
		// and it has a cookie (i.e has credentials)
		if (cookie) {
			const newSession = getSessionToken(cookie);
			// and session token does not equal the one held in memory
			if (!newSession || newSession !== sessionToken) {
				// then clear all the personal caches
				// in case someone makes an asynchronous mistake sometime,
				// make sure we keep a reference to the session we're actually clearing
				const oldSession = sessionToken;
				personalCaches.forEach(name => {
					caches.open(getCacheKey(name, oldSession)).then(cache => {
						cache.keys().then(keys => {
							keys.forEach(key => {
								cache.delete(key);
							})
						})
					})
				})
			}
			sessionToken = newSession;
		}
	}
});

export function registerCache(cacheName) {
	if (sessionToken) {
		personalCaches.push[cacheName];
		return true;
	}

	throw 'No session token found - not creating personal cache';
}

export function getCacheKey(name, token = sessionToken) {
	return `${name}:${token}`;
}

