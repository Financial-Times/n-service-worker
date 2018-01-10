self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'claim') {
		self.clients.claim();
		ev.ports[0].postMessage('claimed');
	}
});

const nativeFetch = fetch;
let fetchCalls = [];

function domainify (url) {
	return (url.charAt(0) === '/') ? self.registration.scope.replace(/\/$/, '')+ url : url;
}

function queryFetchHistory (url, port) {
	port.postMessage(fetchCalls.indexOf(domainify(url)) > -1);
}

function clearFetchHistory (url, port) {
	fetchCalls = fetchCalls.filter(storedUrl => storedUrl !== domainify(url));
	port.postMessage('done');
}

self.fetch = function (req, opts) {
	fetchCalls.push(req.url || req);
	return nativeFetch.call(self, req, opts)
		// slow fetch down a little in test to make doubly sure it's slower than
		// local async operations
		.then(res => {
			return new Promise(resolve => setTimeout(() => resolve(res), 50));
		});
};

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'queryFetchHistory') {
		queryFetchHistory(msg.url, ev.ports[0]);
	} else if (msg.type === 'clearFetchHistory') {
		clearFetchHistory(msg.url, ev.ports[0]);
	}
});

// For testing flagged caches
import router from '../../src/utils/router';
import { getHandler } from '../../src/utils/handlers';
import precache from '../../src/utils/precache';

const testCacheOptions = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'test-cache-v1',
		maxEntries: 50
	}
};

precache(
	'test-cache-v1',
	['/__assets/creatives/backgrounds/header-markets-data.png'],
	{ maxAge: -1 }
);

const cacheFirstHandler = getHandler({strategy: 'cacheFirst', flag: 'testCacheFlag'});
router.get('/__assets/creatives/backgrounds/header-markets-data.png', cacheFirstHandler, testCacheOptions);
const fastestHandler = getHandler({strategy: 'fastest', flag: 'testCacheFlag'});
router.get('/__origami/service/image/v2/images/raw/ftlogo:brand-nikkei-tagline', fastestHandler, testCacheOptions);



// Don't use import here. For some reason (probably a very interesting one)
// If this is imported then the code in it runs before the code above in
// karma tests
// TODO - investigate this properly
require('../../src/__sw');
