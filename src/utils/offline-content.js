import * as _url from 'url';

/*
 * Same content, lower bandwidth.
 *
 * Precache article for offline use.
 * Returns a fetch response for an 'offline' version of original request.
 */

// pathname starts with '/content/'
const isContentUrl = (path) => /^\/content\//.test(path);

export default function (url) {
	let req;
	let urlObj = _url.parse(url);

	if (isContentUrl(urlObj.pathname)) {
		urlObj.pathname = `/offline${urlObj.pathname}`;
	}

	req = new Request(_url.format(urlObj), {
		credentials: 'same-origin'
	});

	return fetch(req);
}
