/* global SWTestBundles */
describe('n-ui', () => {
	SWTestBundles.checkCacheIsUsed({
		assetLabel: 'shared js',
		url: 'https://www.ft.com/__assets/n-ui/cached/v2/es5-core-js.min.js',
		expiry: 'no-expiry',
		upgradeToCors: true,
		cacheName: 'n-ui',
		strategy: 'fastest'
	})
});
