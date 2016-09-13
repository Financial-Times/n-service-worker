import router from '../utils/router';;

import { getHandler } from '../utils/handlers';

// Attempt to cache static assets served by lifefyre
const cacheOptions = {
	name: 'comments',
	maxEntries: 20
};

const handler = getHandler({strategy: 'cacheFirst', flag: 'swCommentsAssets'})

router.get('/*.js', handler, {
	origin: 'https://cdn.livefyre.com',
	cache: cacheOptions
});

router.get('/*.css', handler, {
	origin: 'https://cdn.livefyre.com',
	cache: cacheOptions
});

// any file from a particular cloudfront instance
// who knows if this url will always work
router.get('/*', handler, {
	origin: 'https://d3qdfnco3bamip.cloudfront.net',
	cache: cacheOptions
});

// any file with lifefyre in it served from cloudfront
router.get('/*livefyre*', handler, {
	origin: 'https://*.cloudfront.net',
	cache: cacheOptions
});
