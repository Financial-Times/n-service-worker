import cache from './cache';

const getUuid = () =>
	cache('session')
		.then(cache => cache.get('https://session-next.ft.com/uuid'))
		.then(response => response ? response.json() : { })
		.then(({ uuid }) => uuid)
		.catch(() => { });

export default getUuid;