/* global SWTestBundles */
describe.skip('polyfill', () => {
	SWTestBundles.checkCacheIsUsed({
		assetLabel: 'polyfill service',
		url: '/__origami/service/polyfill/v2/polyfill.min.js?features=default,requestAnimationFrame,Promise,matchMedia,HTMLPictureElement,fetch,Array.prototype.find,Array.prototype.findIndex,IntersectionObserver&flags=gated&unknown=polyfill&callback=ftNextPolyfillServiceCallback&excludes=Symbol,Symbol.iterator,Symbol.species,Map,Set&source=n-service-worker-tests',
		expiry: 'no-expiry',
		cacheName: 'polyfill-v1',
		flag: 'swAssetCaching',
		strategy: 'fastest'
	});
});
