/* global SWTestHelper */
describe('built-assets', () => {

	[
		['css', 'https://next-geebee.ft.com/hashed-assets/front-page/a13b0424/main.css'],
		['js', 'https://next-geebee.ft.com/hashed-assets/front-page/e763894c/main-without-n-ui.js'],
	].forEach(([label, url]) =>
		SWTestHelper.checkCacheIsUsed({
			assetLabel: label,
			url,
			expiry: 60 * 60 * 24 * 5,
			mode: 'no-cors',
			cacheName: 'built-assets'
		})
	);

});
