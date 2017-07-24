/* global SWTestBundles */
describe('images', () => {

	[
		'fticon-v1:hamburger?source=o-icons&tint=%2333302E,%2333302E&format=svg',
		'fticon-v1:search?source=o-icons&tint=%2333302E,%2333302E&format=svg',
		'ftlogo:brand-ft-masthead?source=o-header&tint=%2333302E,%2333302E&format=svg',
		'ftlogo:brand-myft?source=o-header&tint=%2333302E,%2333302E&format=svg'
	]
	.map(image => {

		const url = `/__origami/service/image/v2/images/raw/${image}`;
		const expiry = 'no-expiry';
		const cacheName ='image';

		SWTestBundles.checkGetsPrecached({
			url,
			assetLabel: `header icon ${image} forever`,
			expiry,
			cacheName
		});

		SWTestBundles.checkCacheIsUsed({
			assetLabel: `header icon ${image}`,
			url,
			expiry,
			cacheName,
			flag: 'swAssetCaching'
		});
	});

	[
		['icons', '/__origami/service/image/v2/images/raw/fticon:arrow-right?source=o-icons&tint=%239E2F50,%239E2F50&format=svg'],
		['logos', '/__origami/service/image/v2/images/raw/ftlogo:brand-myft?source=next&tint=%239E2F50,%239E2F50&format=svg'],
		['social icons', '/__origami/service/image/v2/images/raw/ftsocial:linkedin?source=o-share&format=svg'],
		['next assets', '/__assets/creatives/backgrounds/header-markets-data.png']
	].forEach(([label, url]) =>
		SWTestBundles.checkCacheIsUsed({
			assetLabel: label,
			url,
			expiry: 'no-expiry',
			cacheName: 'image',
			flag: 'swAssetCaching'
		})
	);

});
