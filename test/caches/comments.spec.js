describe('comments', function() {

  [
		['livefyre cdn', 'https://cdn.livefyre.com/libs/Livefyre/v0.8.0/builds/278/Livefyre.min.js'],
		['livefyre cloudfront cdn', 'https://d3qdfnco3bamip.cloudfront.net/wjs/v3.0.1473372940/css/livefyre_main.css'],
	].forEach(([label, url]) =>
		SWTestHelper.checkCacheIsUsed({
			assetLabel: label,
			url,
			expiry: 'no-expiry',
			mode: 'no-cors',
			cacheName: 'comments',
      flag: 'swCommentsAssets'
		})
	);

});