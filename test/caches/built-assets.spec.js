/* global SWTestHelper */
describe('built-assets', () => {

	[
		['css', 'https://www.ft.com/__assets/hashed/front-page/a13b0424/main.css'],
		['js', 'https://www.ft.com/__assets/hashed/front-page/e763894c/main-without-n-ui.js'],
	].forEach(([label, url]) =>
		SWTestHelper.checkCacheIsUsed({
			assetLabel: label,
			url,
			expiry: 60 * 60 * 24 * 5,
			upgradeToCors: true,
			cacheName: 'built-assets'
		})
	);

});
