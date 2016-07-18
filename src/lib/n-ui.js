import toolbox from 'sw-toolbox';

const cacheOptions = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: 'n-ui',
		maxEntries: 8
	}
};

// n-ui route
// use toolbox.fastest as we want to send requests to check last-modified headers for n-ui bundle
toolbox.router.get('/n-ui/*', toolbox.fastest, cacheOptions);
