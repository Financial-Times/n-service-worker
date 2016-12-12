/*
 * Simple message router
 *
 * Attatch handlers that route via messageEvent.data.command
 */

import keyMatch from '../utils/map-key-match';

/* routes */
class Route {

	constructor (name, handler, options) {
		this.name = name;
		this.handler = handler;
		this.options = options;
	}

	makeHandler (name) {
		return function (data, response) {
			return this.handler(data, response, this.options);
		}.bind(this);
	}

}

/* router */
class Router {

	constructor (opts) {
		this.routes = new Map();
	}

	command (name, handler, options) {
		options = options || {};
		const route = new Route(name, handler, options);
		this.routes.set(name, route);
	}

	match (command) {
		const routes = keyMatch(this.routes, command);
		if (routes.length > 0) {
			return routes[0].makeHandler(command);
		}
		return null;
	}

}

// export singleton
export let router = new Router();
