self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'claim') {
		self.clients.claim();
		ev.ports[0].postMessage('claimed')
	}
});

const nativeFetch = fetch;
let fetchCalls = [];

function queryFetchHistory (url, port) {
	console.log(fetchCalls.indexOf('https://next-geebee.ft.com/n-ui/cached/v2/es5-core-js.min.js'), fetchCalls);
	port.postMessage(fetchCalls.indexOf(url) > -1)
}

function clearFetchHistory (url, port) {
	fetchCalls = fetchCalls.filter(storedUrl => storedUrl !== url)
	port.postMessage('done')
}

self.fetch = function (req, opts) {
	fetchCalls.push(req.url || req);
	return nativeFetch.call(self, req, opts);
}

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'queryFetchHistory') {
		queryFetchHistory(msg.url, ev.ports[0]);
	} else if (msg.type === 'clearFetchHistory') {
		clearFetchHistory(msg.url, ev.ports[0]);
	}
});

import '../../src/__sw'
