import toolbox from 'sw-toolbox';
import {cacheFirst} from '../utils/flagged-toolbox';

// Attempt to cache static assets served by lifefyre
const cacheOptions = {
	name: 'next:comments',
	maxEntries: 20
};

toolbox.router.get('/*.js', cacheFirst('swCommentsAssets'), {
	origin: 'https://cdn.livefyre.com',
	cache: cacheOptions
});

toolbox.router.get('/*.css', cacheFirst('swCommentsAssets'), {
	origin: 'https://cdn.livefyre.com',
	cache: cacheOptions
});

// any file from a particular cloudfront instance
// who knows if this url will always work
toolbox.router.get('/*', cacheFirst('swCommentsAssets'), {
	origin: 'https://d3qdfnco3bamip.cloudfront.net',
	cache: cacheOptions
});

// any file with lifefyre in it served from cloudfront
toolbox.router.get('/*livefyre*', cacheFirst('swCommentsAssets'), {
	origin: 'https://*.cloudfront.net',
	cache: cacheOptions
});
