/* global SWTestBundles */
describe.only('polyfill', () => {
	SWTestBundles.checkCacheIsUsed({
		assetLabel: 'polyfill service',
		url: '/__origami/service/polyfill/v2/polyfill.min.js?features=default&source=n-service-worker-tests',
		expiry: 'no-expiry',
		cacheName: 'polyfill',
		flag: 'swAssetCaching',
		strategy: 'fastest'
	});
});
