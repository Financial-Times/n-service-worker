describe('ads', function() {

	[
		'MQ==-U2VjdGlvbnM=',
		'Mjk=-U2VjdGlvbnM=',
		'NzE=-U2VjdGlvbnM=',
		'MTE2-U2VjdGlvbnM=',
		'MTI1-U2VjdGlvbnM=',
		'MTQ4-U2VjdGlvbnM=',
		'MTQw-U2VjdGlvbnM=',
		'NTQ=-U2VjdGlvbnM=',
		'NTlhNzEyMzMtZjBjZi00Y2U1LTg0ODUtZWVjNmEyYmU1NzQ2-QnJhbmRz' // fastft
	].map(concept =>
		SWTestHelper.checkGetsPrecached({
			url: `https://ads-api.ft.com/v1/concept/${concept}`,
			assetLabel: `asset metadata for section ${concept}`,
			expiry: 7 * 60 * 60 * 24 * 1000,
			cacheName: 'ads'
		})
	);

	[
		['sections', 'https://ads-api.ft.com/v1/concept/MQ==-U2VjdGlvbnM=', 7, 'cors', true],
		['streams', 'https://ads-api.ft.com/v1/concept/MTM4-U2VjdGlvbnM=', 7, 'cors'],
		['google tag library', 'https://www.googletagservices.com/tag/js/gpt.js', 7, 'no-cors'],
		['google stuff', 'https://partner.googleadservices.com/gpt/pubads_impl_95.js', 30, 'no-cors'],
		['more google stuff', 'https://pagead2.googlesyndication.com/pagead/osd.js', 1, 'no-cors'],
		['yet more google stuff', 'https://tpc.googlesyndication.com/safeframe/1-0-4/html/container.html', 1/24, 'no-cors'],
		['krux tag', 'https://cdn.krxd.net/controltag/KHUSeE3x.js', 7, 'no-cors'],
		['krux lib', 'https://cdn.krxd.net/ctjs/controltag.js.d4d7fc61dff29ba846cb4a9ffc42cbf9', 30, 'no-cors'],
	].forEach(([label, url, expiry, mode, relativeToInstall]) =>
		SWTestHelper.checkCacheIsUsed({
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

