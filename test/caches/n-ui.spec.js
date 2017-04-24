/* global SWTestBundles */
describe('n-ui', () => {
	SWTestBundles.checkCacheIsUsed({
		assetLabel: 'shared js',
		url: 'https://www.ft.com/__assets/n-ui/cached/v4.0.0/es5.min.js',
		expiry: 'no-expiry',
		upgradeToCors: true,
		cacheName: 'n-ui'
	})
});
