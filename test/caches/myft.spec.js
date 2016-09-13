/* global SWTestHelper */
describe('myft', () => {
	[
		'preferred/preference',
		'enabled/endpoint',
		'followed/concept',
		'saved/content',
		'created/list'
	]
		.map(node => {
			https://www.ft.com/__myft/api/onsite/6ccc5a3f-ebb5-4f3b-962a-bd3ce35cae20/preferred/preference
		})

function purgeCache (request) {
	let resource = request.url.replace('/user', '');

	cache('next:myft')
		.then(cache => cache.keys())
		.then(keys => keys.some(key => {
			if (resource.indexOf(key.url) === 0) {
				cache.delete(key);
				return true;
			}
		}))

	return fetch(request)
}

registerCache('next:myft');

router.get('/__myft/api/*', getHandler({strategy: 'cacheFirst', flag: 'swMyftCaching'}), options);
router.put('/__myft/api/*', purgeCache);
router.post('/__myft/api/*', purgeCache);
router.delete('/__myft/api/*', purgeCache);


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
		['krux - user', 'https://cdn.krxd.net/userdata/get?pub=bcbe1a6d-fa90-4db5-b4dc-424c69802310&technographics=1&callback=Krux.ns._default.kxjsonp_userdata', 1, 'no-cors']
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

	it('should clear personal ads metadata caches on logout', () => {
		fetch('/logout')
			.then(() => {
				return Promise.all([
					SWTestHelper.checkNotCached('https://ads-api.ft.com/v1/user', 'ads'),
					SWTestHelper.checkNotCached('https://cdn.krxd.net/userdata/get?pub=bcbe1a6d-fa90-4db5-b4dc-424c69802310&technographics=1&callback=Krux.ns._default.kxjsonp_userdata', 'ads')
				])
			})
	})

});
