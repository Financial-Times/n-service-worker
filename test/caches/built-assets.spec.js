/* global SWTestBundles */
describe('built-assets', () => {

	[
		['css', '/__assets/hashed/front-page/a13b0424/main.css'],
		['js', '/__assets/hashed/front-page/e763894c/main-without-n-ui.js'],
	].forEach(([label, url]) =>
		SWTestBundles.checkCacheIsUsed({
			assetLabel: label,
			url,
			expiry: 60 * 60 * 24 * 5,
			cacheName: 'built-assets-v1',
			flag: 'swAssetCaching'
		})
	);

});
