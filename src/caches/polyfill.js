import toolbox from 'sw-toolbox';

import { fastest } from '../utils/cache';

const options = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: 'next:polyfill',
		maxEntries: 4
	}
};

// use toolbox.fastest as we want to send requests to check last-modified headers for polyfill
toolbox.router.get('/polyfill/*', fastest, options);
