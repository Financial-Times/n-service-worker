import * as _url from 'url';

/*
 * Same content, lower bandwidth.
 *
 * Precache article for offline use.
 * Returns a request object in order to fetch an 'offline' version of original request.
 */

// pathname starts with '/content/'
const isContentUrl = (path) => /^\/content\//.test(path);

export default function (url) {
	const urlObj = _url.parse(url);

	if (isContentUrl(urlObj.pathname)) {
		urlObj.pathname = `/offline${urlObj.pathname}`;
	}

	return new Request(_url.format(urlObj), {
		credentials: 'same-origin',
		headers: {
			'x-requested-with': 'ft-sw'
		}
	});
}
