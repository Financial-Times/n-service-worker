
export default function (data, res) {
	console.log('SW: look command called with', data);
	res({
		look: 'response',
		foo: 'bar'
	});
}
