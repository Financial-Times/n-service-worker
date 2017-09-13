/* global SWTestBundles */
describe('ads', () => {
    [
        'd8009323-f898-3207-b543-eab4427b7a77',	// world
        '852939c8-859c-361e-8514-f82f6c041580',	// companies
        'd969d76e-f8f4-34ae-bc38-95cfd0884740', // markets
        '38dbd827-fedc-3ebe-919f-e64cf55ea959', // opinion
        'f814d8f7-d38e-31b8-a51f-3882805288fd', // work & careers
        'f967910f-67d5-31f7-a031-64f8af0d9cf1', // life and arts
        '59fd6642-055c-30b0-b2b8-8120bc2990af', // personal finance
        '40433e6c-d2ac-3994-b168-d33b89b284c7', // science
        '5c7592a8-1f0c-11e4-b0cb-b2227cce2b54' 	// fastft
    ].map(concept =>
		SWTestBundles.checkGetsPrecached({
			url: `https://ads-api.ft.com/v1/concept/${concept}`,
			assetLabel: `asset metadata for section ${concept}`,
			expiry: 7 * 60 * 60 * 24 * 1000,
			cacheName: 'ads'
		})
	);

	[
		['streams', 'https://ads-api.ft.com/v1/concept/676fa5a9-7d01-332b-b308-7c4ddb3a92e0', 1, 'cors'],
		['google tag library', 'https://www.googletagservices.com/tag/js/gpt.js', 7, 'no-cors'],
		['google stuff', 'https://securepubads.g.doubleclick.net/gpt/pubads_impl_95.js', 7, 'no-cors'],
		['more google stuff', 'https://pagead2.googlesyndication.com/pagead/osd.js', 1, 'no-cors'],
		['yet more google stuff', 'https://tpc.googlesyndication.com/safeframe/1-0-4/html/container.html', 1/24, 'no-cors'],
		['krux tag', 'https://cdn.krxd.net/controltag/KHUSeE3x.js', 7, 'no-cors'],
		['krux lib', 'https://cdn.krxd.net/ctjs/controltag.js.d4d7fc61dff29ba846cb4a9ffc42cbf9', 7, 'no-cors'],
	].forEach(([label, url, expiry, mode, relativeToInstall]) =>
		SWTestBundles.checkCacheIsUsed({
			assetLabel: label,
			url,
			expiry: expiry * 60 * 60 * 24 * 1000,
			expireRelativeToInstall: relativeToInstall,
			mode,
			cacheName: 'ads',
			flag: 'swAdsCaching'
		})
	);


// toolbox.router.get('/userdata/*', cacheFirstFlagged('swAdsCaching'), {
// 	origin: 'https://cdn.krxd.net',
// 	cache: getCacheOptions(1, true)
// });

// toolbox.router.get('/v1/user', cacheFirstFlagged('swAdsCaching'), {
// 	origin: 'https://ads-api.ft.com',
// 	cache: getCacheOptions(7, true)
// });

});
