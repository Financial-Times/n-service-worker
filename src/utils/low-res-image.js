
import * as _url from 'url';
import * as _qs from 'querystring';

/*
 * Same image, lower resolution.
 *
 * Useful for precaching images for offline use.
 * Returns a fetch response for a low res version of original request.
 * Will serve via the image service, even if original request did not.
 */

const defaultOpts = {
	quality: 'medium',
	width: '150',
	source: 'offline-ft-sw'
}

// url path starts with '/__origami/service/image/'
const isImageServicePath = (path) => /^\/\_\_origami\/service\/image\//.test(path);

const requestViaImageService = (url) => `/__origami/service/image/v2/images/raw/${encodeURIComponent(url)}`;

export default function (url) {
	let req;
	let urlObj = _url.parse(url);

	if (!isImageServicePath(urlObj.path)) {
		urlObj = _url.parse(requestViaImageService(url));
	}

	const qsObj = _qs.parse(urlObj.query);

	delete urlObj.search; // causes _url.format() to use .query obj
	urlObj.query = Object.assign({}, qsObj, defaultOpts);

	req = _url.format(urlObj);

	return fetch(req);
}
