/* global SWTestHelper */
describe('polyfill', () => {
	SWTestBundles.checkCacheIsUsed({
		assetLabel: 'polyfill service',
		url: 'https://next-geebee.ft.com/polyfill/v2/polyfill.min.js?features=default,requestAnimationFrame,Promise,matchMedia,HTMLPictureElement,fetch,Array.prototype.find,Array.prototype.findIndex,IntersectionObserver&flags=gated&unknown=polyfill&callback=ftNextPolyfillServiceCallback&excludes=Symbol,Symbol.iterator,Symbol.species,Map,Set',
		expiry: 'no-expiry',
		upgradeToCors: true,
		cacheName: 'polyfill',
		strategy: 'fastest'
	})
});
