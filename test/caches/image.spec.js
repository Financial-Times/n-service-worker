/* global SWTestBundles */
describe('images', () => {

	[
		'fticon-v1:hamburger?source=o-icons&tint=%23505050,%23505050&format=svg',
		'fticon-v1:search?source=o-icons&tint=%23505050,%23505050&format=svg',
		'ftlogo:brand-ft-masthead?source=o-header&tint=%23505050,%23505050&format=svg',
		'ftlogo:brand-myft?source=o-header&tint=%23505050,%23505050&format=svg'
	]
	.map(image => {

		const url = `https://www.ft.com/__origami/service/image/v2/images/raw/${image}`;
		const expiry = 'no-expiry';
		const cacheName ='image';

		SWTestBundles.checkGetsPrecached({
			url,
			assetLabel: `header icon ${image} forever`,
			expiry,
			cacheName
		})

		SWTestBundles.checkCacheIsUsed({
			assetLabel: `header icon ${image}`,
			url,
			expiry,
			upgradeToCors: true,
			cacheName
		})
	});

	[
		['icons', 'https://www.ft.com/__origami/service/image/v2/images/raw/fticon:arrow-right?source=o-icons&tint=%239E2F50,%239E2F50&format=svg'],
		['logos', 'https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo:brand-myft?source=next&tint=%239E2F50,%239E2F50&format=svg'],
		['social icons', 'https://www.ft.com/__origami/service/image/v2/images/raw/ftsocial:linkedin?source=o-share&format=svg'],
		['next assets', 'https://www.ft.com/__assets/creatives/backgrounds/header-markets-data.png']
	].forEach(([label, url]) =>
		SWTestBundles.checkCacheIsUsed({
			assetLabel: label,
			url,
			expiry: 'no-expiry',
			upgradeToCors: true,
			cacheName: 'image'
		})
	);

});
