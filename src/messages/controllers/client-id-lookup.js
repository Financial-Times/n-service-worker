
export default function (data, source, event, res) {
	res({ clientId: event.source.id });
}
