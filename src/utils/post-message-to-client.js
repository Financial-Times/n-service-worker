
export default function postMessageToClient (client, data) {

	return new Promise ((resolve, reject) => {
		let messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = (ev) => {
			if (ev.data.error) {
				reject(ev.data.error);
			} else {
				resolve(ev.data);
			}
		}

		try {
			client.postMessage(data, [messageChannel.port2]);;
		} catch (e) {
			e.message = `Failed to post message to client: ${e.message}`;
			reject(e);
		}

	});

}
