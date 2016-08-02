import toolbox from 'sw-toolbox';

const cacheOptions = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: 'next:polyfill',
		maxEntries: 4,
		expireOldestFirst: true
	}
};

// use toolbox.fastest as we want to send requests to check last-modified headers for polyfill
toolbox.router.get('/polyfill/*', toolbox.fastest, cacheOptions);
