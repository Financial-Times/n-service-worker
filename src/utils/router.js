/*
	Copyright 2014 Google Inc. All Rights Reserved.

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

			http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/
'use strict';

const Route = require('./route');

function regexEscape (s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const keyMatch = function (map, string) {
	// This would be better written as a for..of loop, but that would break the
	// minifyify process in the build.
	const entriesIterator = map.entries();
	let item = entriesIterator.next();
	const matches = [];
	while (!item.done) {
		const pattern = new RegExp(item.value[0]);
		if (pattern.test(string)) {
			matches.push(item.value[1]);
		}
		item = entriesIterator.next();
	}
	return matches;
};

const Router = function () {
	this.routes = new Map();
	// Create the dummy origin for RegExp-based routes
	this.routes.set(RegExp, new Map());
	this.default = null;
};

['get', 'post', 'put', 'delete', 'head', 'any'].forEach(function (method) {
	Router.prototype[method] = function (path, handler, options) {
		return this.add(method, path, handler, options);
	};
});

Router.prototype.add = function (method, path, handler, options) {
	options = options || {};
	let origin;

	if (path instanceof RegExp) {
		// We need a unique key to use in the Map to distinguish RegExp paths
		// from Express-style paths + origins. Since we can use any object as the
		// key in a Map, let's use the RegExp constructor!
		origin = RegExp;
	} else {
		origin = options.origin || self.location.origin;
		if (origin instanceof RegExp) {
			origin = origin.source;
		} else {
			origin = regexEscape(origin);
		}
	}

	method = method.toLowerCase();

	const route = new Route(method, path, handler, options);

	if (!this.routes.has(origin)) {
		this.routes.set(origin, new Map());
	}

	const methodMap = this.routes.get(origin);
	if (!methodMap.has(method)) {
		methodMap.set(method, new Map());
	}

	const routeMap = methodMap.get(method);
	const regExp = route.regexp || route.fullUrlRegExp;
	routeMap.set(regExp.source, route);
};

Router.prototype.matchMethod = function (method, url) {
	const urlObject = new URL(url);
	const origin = urlObject.origin;
	const path = urlObject.pathname;

	// We want to first check to see if there's a match against any
	// "Express-style" routes (string for the path, RegExp for the origin).
	// Checking for Express-style matches first maintains the legacy behavior.
	// If there's no match, we next check for a match against any RegExp routes,
	// where the RegExp in question matches the full URL (both origin and path).
	return this._match(method, keyMatch(this.routes, origin), path) ||
		this._match(method, [this.routes.get(RegExp)], url);
};

Router.prototype._match = function (method, methodMaps, pathOrUrl) {
	if (methodMaps.length === 0) {
		return null;
	}

	for (let i = 0; i < methodMaps.length; i++) {
		const methodMap = methodMaps[i];
		const routeMap = methodMap && methodMap.get(method.toLowerCase());
		if (routeMap) {
			const routes = keyMatch(routeMap, pathOrUrl);
			if (routes.length > 0) {
				return routes[0].makeHandler(pathOrUrl);
			}
		}
	}

	return null;
};

Router.prototype.match = function (request) {
	return this.matchMethod(request.method, request.url) ||
			this.matchMethod('any', request.url);
};

module.exports = new Router();
