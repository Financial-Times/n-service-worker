/* global SWTestBundles */

const useragent = require('useragent');

describe('fonts', () => {
	const fonts = ['MetricWeb-Regular', 'MetricWeb-Semibold'];

	// FIXME: Fonts in firefox are being weird generally, this one is particularly bad and fails every time
	if (useragent.is(navigator.userAgent).chrome) {
		fonts.push('FinancierDisplayWeb-Regular');
	}

	fonts.map(font => {
		const url = `/__origami/service/build/v2/files/o-fonts-assets@1.3.2/${font}.woff?`;
		const expiry = 'no-expiry';
		const cacheName ='fonts';

		SWTestBundles.checkGetsPrecached({
			url,
			assetLabel: `font ${font} forever`,
			expiry,
			cacheName
		});

		SWTestBundles.checkCacheIsUsed({
			assetLabel: font,
			url,
			expiry,
			mode: 'cors',
			cacheName,
			flag: 'swAssetCaching'
		});

	});
});
