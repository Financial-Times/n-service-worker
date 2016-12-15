/* global clients */
import './controllers';
import { router } from './routing';

const replyTo = (client, data) => client.postMessage(data);

const replyToPage = (event) => replyTo.bind(null, event.ports[0]);

export function messageHandler (ev) {
	const data = ev.data && ev.data.data ? ev.data.data : {};
	const source = ev.data.source;
	const res = replyToPage(ev);

	const handler = router.match(ev.data.command);

	if (handler) {
		return handler(data, source, ev, res);
	}
}

export function broadcast (command, data={}) {
	let msg = { command, data };
	clients.matchAll().then(clients => {
		clients.forEach(client => client.postMessage(msg));
	})
}
