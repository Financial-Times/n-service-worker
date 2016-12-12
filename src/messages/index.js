import './controllers';
import { router } from './routing';

const replyTo = (client, data) => client.postMessage(data);

const replyToPage = (event) => replyTo.bind(null, event.ports[0]);

export function messageHandler (ev) {
	console.log('handler called with', ev)
	const data = ev.data && ev.data.data ? ev.data.data : {};
	const res = replyToPage(ev);

	const handler = router.match(ev.data.command);

	if (handler) {
		return handler(data, ev, res);
	}
}
