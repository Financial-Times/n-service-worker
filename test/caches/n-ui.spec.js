/* global SWTestHelper */
describe('n-ui', () => {
	SWTestHelper.checkCacheIsUsed({
		assetLabel: 'shared js',
		url: 'https://next-geebee.ft.com/n-ui/cached/v2/es5-core-js.min.js',
		expiry: 'no-expiry',
		upgradeToCors: true,
		cacheName: 'n-ui',
		strategy: 'fastest'
	})
});
