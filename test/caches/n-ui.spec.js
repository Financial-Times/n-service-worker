/* global SWTestBundles */
describe('n-ui', () => {
	SWTestBundles.checkCacheIsUsed({
		assetLabel: 'shared js',
		url: '/__assets/n-ui/cached/v4.0.0/es5.min.js',
		expiry: 'no-expiry',
		cacheName: 'n-ui',
		flag: 'swAssetCaching'
	});
});
