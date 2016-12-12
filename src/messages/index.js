import './controllers';
import { router } from './routing';
import postMessageToClient from '../utils/post-message-to-client';

const replyTo = (client, data) => client.postMessage(data);
// const replyTo = (client, clientId, data) => client.postMessage({data, clientId});

const replyToPage = (event) => replyTo.bind(null, event.ports[0]);
// const replyToPage = (event) => replyTo.bind(null, event.ports[0], event.cliendId);

// const replyToClient = (ev, data) => clients.get(ev.clientId).then(client => replyTo(client, data));

export function messageHandler (ev) {
	console.log('handler called with', ev)
	const data = ev.data && ev.data.data ? ev.data.data : {};
	const res = replyToPage(ev);

	const handler = router.match(ev.data.command);

	if (handler) {
		return handler(data, res);
	}
}

//
export function replyToEventClient (event, data) {
	// console.log('sending message to clientid of fetch req');
	return clients.get(event.clientId).then(client => postMessageToClient(client, data));
}

export function sendToClient (data, clientId=null, _broadcast=false) {

	if (_broadcast) {
		return broadcast(data);
	} else {
		return postMessageToClient(clientId, data);
	}
}

////
export function broadcast (msg) {
	console.log('broadcasting message');

	clients.matchAll().then(clients => {
		clients.forEach(client => {
			postMessageToClient(client, msg).then(m => console.log("SW: Received Message:", m));
		})
	})
}
