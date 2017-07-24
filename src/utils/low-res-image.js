import * as _url from 'url';
import * as _qs from 'querystring';

/*
 * Same image, lower resolution.
 *
 * Useful for precaching images for offline use.
 * Returns a url used to fetch a low res version of original request.
 * Will transform to an image service url, even if original request was not.
 */

const defaultOpts = {
	quality: 'medium',
	width: '150',
	source: 'offline-ft-sw'
};

// url path starts with '/__origami/service/image/'
const isImageServicePath = (path) => /^\/\_\_origami\/service\/image\//.test(path);

const requestViaImageService = (url) => `/__origami/service/image/v2/images/raw/${encodeURIComponent(url)}`;

export default function (url) {
	let urlObj = _url.parse(url);

	if (!isImageServicePath(urlObj.path)) {
		urlObj = _url.parse(requestViaImageService(url));
	}

	const querystringObj = _qs.parse(urlObj.query);

	delete urlObj.search; // causes _url.format() to use .query obj
	urlObj.query = Object.assign({}, querystringObj, defaultOpts);

	const imageServiceUrl = _url.format(urlObj);

	return imageServiceUrl;
}
