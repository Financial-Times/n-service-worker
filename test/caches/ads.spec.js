/* global SWTestHelper */
describe('ads', () => {

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
		['ads api - user', 'https://ads-api.ft.com/v1/user', 7, 'cors'],
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

	it('should clear personal caches on logout', () => {
		fetch('/logout')
			.then(() => {
				return Promise.all([
					SWTestHelper.checkNotCached('https://ads-api.ft.com/v1/user', 'ads'),
					SWTestHelper.checkNotCached('https://cdn.krxd.net/userdata/get?pub=bcbe1a6d-fa90-4db5-b4dc-424c69802310&technographics=1&callback=Krux.ns._default.kxjsonp_userdata', 'ads')
				])
			})
	})


});
