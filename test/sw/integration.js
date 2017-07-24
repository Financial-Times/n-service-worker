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
	return nativeFetch.call(self, req, opts);
};

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'queryFetchHistory') {
		queryFetchHistory(msg.url, ev.ports[0]);
	} else if (msg.type === 'clearFetchHistory') {
		clearFetchHistory(msg.url, ev.ports[0]);
	}
});
// Don't use import here. For some reason (probably a very interesting one)
// If this is imported then the code in it runs before the code above in
// karma tests
// TODO - investigate this properly
require('../../src/__sw');
