
export default function (data, event, res) {
	console.log('SW: lookup command called with', data);
	console.log(event);
	res({
		look: 'response',
		foo: 'bar'
	});
}
