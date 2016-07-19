import toolbox from 'sw-toolbox';

const cacheOptions = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: 'next:content',
		// our code base moves so fast, pointless caching enything longer than a few days
		maxAgeSeconds: 60
	}
};
toolbox.router.get('/', toolbox.fastest, cacheOptions);
