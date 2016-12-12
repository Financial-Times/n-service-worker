
export default function (data, event, res) {
	res({ clientId: event.source.id });
}
