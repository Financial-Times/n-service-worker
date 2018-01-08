import router from '../utils/router';

export default function init (cacheHandler) {
	// Attempt to cache static assets served by lifefyre
	const cacheOptions = {
		name: 'comments-v1',
		maxEntries: 20
	};

	router.get('/*.js', cacheHandler, {
		origin: 'https://cdn.livefyre.com',
		cache: cacheOptions
	});

	router.get('/*.css', cacheHandler, {
		origin: 'https://cdn.livefyre.com',
		cache: cacheOptions
	});

	// any file from a particular cloudfront instance
	// who knows if this url will always work
	router.get('/*', cacheHandler, {
		origin: 'https://d3qdfnco3bamip.cloudfront.net',
		cache: cacheOptions
	});

	// any file with lifefyre in it served from cloudfront
	router.get('/*livefyre*', cacheHandler, {
		origin: 'https://*.cloudfront.net',
		cache: cacheOptions
	});
}
