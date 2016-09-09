describe('n-ui', function() {

  [
		['shared js', 'https://next-geebee.ft.com/n-ui/cached/v2/es5-core-js.min.js']
	].forEach(([label, url]) => {
		SWTestHelper.checkCacheIsUsed({
			assetLabel: label,
			url,
			expiry: 'no-expiry',
			mode: 'no-cors',
			cacheName: 'n-ui',
			strategy: 'fastest'
		})
	});
});