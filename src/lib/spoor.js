import toolbox from 'sw-toolbox';

import DB from '../utils/db'

const options = {
	origin: 'https://spoor-api.ft.com'
};

const sync = () => { };

toolbox.router.post('/ingest', request => {
	const clonedRequest = request.clone();
	// try and post the data, otherwise store in cache
	return fetch(request)
		.then(response => {
			if (response.ok) {
				// get the request's body and cach
				return clonedRequest.json()
					.then(data => {
						const db = new DB('spoor');
						return db.set(data.context.id, data)
					})
					.then(() => response)
					.catch(err => {
						console.log(err);
						return response;
					})
			} else {
				return response;
			}
		});
}, options);
