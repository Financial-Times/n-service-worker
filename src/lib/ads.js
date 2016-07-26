import toolbox from 'sw-toolbox';
import {cacheFirst} from '../utils/flagged-toolbox';
import {registerCache} from '../utils/personal';

const cacheOptions = {
	cache: {
		name: 'next:ads',
		maxAgeSeconds: 60 * 10,
		maxEntries: 60
	}
};

registerCache('next:ads:personal');

//stale on revalidate

https://ads-api.ft.com/v1/user 1 week
https://ads-api.ft.com/v1/concept/* 1 week
 // if not taxonomy specialReports
 // or restrict to sections & popular streams only
https://www.googletagservices.com/tag/js/gpt.js 1 hour / 1 day
https://partner.googleadservices.com/gpt/pubads_impl_*.js long cache
https://pagead2.googlesyndication.com/pagead/osd.js / 1 day


https://tpc.googlesyndication.com/safeframe/1-0-4/html/container.html
 // backgroudn fetch maybe

https://cdn.krxd.net/userdata/* 1 day
https://cdn.krxd.net/controltag?confid=KHUSeE3x - 1 week
https://cdn.krxd.net/ctjs/controltag.js* long cache

//beacon any requests to these domains which we don't cache

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
