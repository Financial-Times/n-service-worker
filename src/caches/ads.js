import router from '../utils/router';
import { registerCache } from '../utils/personal';
// import precache from '../utils/precache';

function getCacheOptions (days, isPersonal) {
	return {
		name: 'ads' + (isPersonal ? ':personal' : '') + '-v1',
		maxAge: 60 * 60 * (days >= 1 ? days * 24 : 1),
		maxEntries: 60
	};
}

// Top menu items, to be pre-loaded
// export const topSections = [
// 	'd8009323-f898-3207-b543-eab4427b7a77',	// world
// 	'852939c8-859c-361e-8514-f82f6c041580',	// companies
// 	'd969d76e-f8f4-34ae-bc38-95cfd0884740', // markets
// 	'6da31a37-691f-4908-896f-2829ebe2309e', // opinion
// 	'f814d8f7-d38e-31b8-a51f-3882805288fd', // work & careers
// 	'f967910f-67d5-31f7-a031-64f8af0d9cf1', // life and arts
// 	'59fd6642-055c-30b0-b2b8-8120bc2990af', // personal finance
// 	'40433e6c-d2ac-3994-b168-d33b89b284c7', // science
// 	'5c7592a8-1f0c-11e4-b0cb-b2227cce2b54' 	// fastft
// ];

export default function init (cacheHandler) {
	registerCache('next:ads:personal-v1');

	// Precache top level topSections
	// Adblockers block ads-api requests
	// net::ERR_BLOCKED_BY_CLIENT cannot be differentiated
	// so we just fail silently by passing isOptional: true
	// const precacheCacheOptions = getCacheOptions(7);
	// precache(
	// 	precacheCacheOptions.name,
	// 	topSections.map(section => `https://ads-api.ft.com/v1/concept/${section}`),
	// 	{ maxAge: precacheCacheOptions.maxAge, maxEntries: precacheCacheOptions.maxEntries },
	// 	{ isOptional: true }
	// );

	// Set up caching for ads-api and third party ads scripts

	// Personalised stuff
	router.get('/v1/user', cacheHandler, {
		origin: 'https://ads-api.ft.com',
		cache: getCacheOptions(7, true)
	});

	router.get('/userdata/*', cacheHandler, {
		origin: 'https://cdn.krxd.net',
		cache: getCacheOptions(1, true)
	});


	router.get('/v1/concept/*', cacheHandler, {
		origin: 'https://ads-api.ft.com',
		cache: getCacheOptions(1)
	});

	router.get('/tag/js/gpt.js', cacheHandler, {
		origin: 'https://www.googletagservices.com',
		cache: getCacheOptions(7)
	});

	router.get('/gpt/pubads_impl_*.js', cacheHandler, {
		origin: 'https://securepubads.g.doubleclick.net',
		cache: getCacheOptions(7)	// was 30
	});

	router.get('/pagead/osd.js', cacheHandler, {
		origin: 'https://pagead2.googlesyndication.com',
		cache: getCacheOptions(1)
	});

	router.get('/safeframe/*/html/container.html', cacheHandler, {
		origin: 'https://tpc.googlesyndication.com',
		cache: getCacheOptions(0)
	});

	router.get('/controltag*', cacheHandler, {
		origin: 'https://cdn.krxd.net',
		cache: getCacheOptions(7)
	});

	router.get('/ctjs/controltag.js*', cacheHandler, {
		origin: 'https://cdn.krxd.net',
		cache: getCacheOptions(7)		// was 30
	});
}
