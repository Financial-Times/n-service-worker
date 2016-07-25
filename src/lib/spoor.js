import toolbox from 'sw-toolbox';

import DB from '../utils/db'

const options = {
	origin: 'https://spoor-api.ft.com'
};

const syncData = () => {
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

const storeData = request =>
	request.json()
		.then(data => {
			const db = new DB('spoor');
			return db.set(data.context.id, data)
		});

self.addEventListener('periodicsync', ev => {
	if (ev.tag === 'spoor') {
		ev.waitUntil(syncData());
	}
});

toolbox.router.post('/ingest', request => {
	const clonedRequest = request.clone();
	// try and post the data, otherwise store in cache
	return fetch(request)
		.then(response => {
			if (!response.ok) {
				// sending of spoor data failed, so store for later
				return storeData(clonedRequest)
					.then(() => response)
					.catch(() => response);
			} else {
				// sync stored spoor data too
				return syncData().then(() => response);
			}
		})
		.catch(err => {
			// sending of spoor data failed, so store for later
			return storeData(clonedRequest)
				.then(() => {
					throw err;
				});
		})
}, options);
