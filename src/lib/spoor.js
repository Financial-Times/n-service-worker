import toolbox from 'sw-toolbox';

import DB from '../utils/db'

const options = {
	origin: 'https://spoor-api.ft.com'
};

const sync = () => {
	const db = new DB('spoor');
	return db.getAll()
		.then(spoorDatas => {
			const spoorRequests = spoorDatas.map(spoorData => {
				const id = spoorData.context.id;
				const spoorRequest = new Request(
					'https://spoor-api.ft.com/ingest', { credentials: 'include', body: spoorData }
				);
				return fetch(spoorRequest)
					.then(response => {
						if (response.ok) {
							return db.delete(id);
						}
					})
					.catch(() => { })
			});
			return Promise.all(spoorRequests);
		})
		.catch(() => { });
};

self.addEventListener('periodicsync', ev => {
	if (ev.tag === 'spoor') {
		ev.waitUntil(sync());
	}
});

toolbox.router.post('/ingest', request => {
	const clonedRequest = request.clone();
	// try and post the data, otherwise store in cache
	return fetch(request)
		.then(response => {
			if (!response.ok) {
				// sending of spoor data failed, so store for later
				return clonedRequest.json()
					.then(data => {
						const db = new DB('spoor');
						return db.set(data.context.id, data)
					})
					.then(() => response)
					.catch(() => response);
			} else {
				// sync stored spoor data too
				return sync().then(response);
			}
		});
}, options);
