import router from '../utils/router';;

import { cacheFirstFlagged } from '../utils/handlers';

// Attempt to cache static assets served by lifefyre
const cacheOptions = {
	name: 'comments',
	maxEntries: 20
};

router.get('/*.js', cacheFirstFlagged('swCommentsAssets'), {
	origin: 'https://cdn.livefyre.com',
	cache: cacheOptions
});

router.get('/*.css', cacheFirstFlagged('swCommentsAssets'), {
	origin: 'https://cdn.livefyre.com',
	cache: cacheOptions
});

// any file from a particular cloudfront instance
// who knows if this url will always work
router.get('/*', cacheFirstFlagged('swCommentsAssets'), {
	origin: 'https://d3qdfnco3bamip.cloudfront.net',
	cache: cacheOptions
});

// any file with lifefyre in it served from cloudfront
router.get('/*livefyre*', cacheFirstFlagged('swCommentsAssets'), {
	origin: 'https://*.cloudfront.net',
	cache: cacheOptions
});
