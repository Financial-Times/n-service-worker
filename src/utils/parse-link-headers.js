/*
Based on https://github.com/thlorenz/parse-link-header
-
Copyright 2013 Thorsten Lorenz.
All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

import qs from 'querystring';
import url from 'url';
import xtend from 'xtend';

function hasRel (x) {
	return x && x.rel;
}

function createObjects (acc, p) {
	// rel="next" => 1: rel 2: next
	const m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/)
	if (m) acc[m[1]] = m[2];
	return acc;
}

function parseLink (link) {
	try {
		const parts = link.split(';')
		const linkUrl = parts.shift().replace(/[<>]/g, '')
		const parsedUrl = url.parse(linkUrl)
		const qry = qs.parse(parsedUrl.query);

		let info = parts
			.reduce(createObjects, {});

		info = xtend(qry, info);
		info.url = linkUrl;
		return info;
	} catch (e) {
		return null;
	}
}

module.exports = function (linkHeader) {
	if (!linkHeader) return null;

	return linkHeader.split(/,\s*</)
		.map(parseLink)
		.filter(hasRel);
};
