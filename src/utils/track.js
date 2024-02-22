export default function (data) {
	data.context = data.context || {};
	data.system = data.system || {};
	data.user = data.user || {};
	data.context.product = 'next';
	data.context.source = 'next-service-worker';
	data.system.source = 'next-service-worker';

	return fetch('https://spoor-api.ft.com/ingest', {
		method: 'post',
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Content-Length': Buffer.from(JSON.stringify(data)).length
		},
		body: JSON.stringify(data)
	}).catch(() => {});
};
