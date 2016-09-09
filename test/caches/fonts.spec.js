
describe('fonts', function() {

  ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'].map(font => {
    const url = `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.3.0/${font}.woff?`;
    const expiry = 'no-expiry';
    const cacheName ='fonts';

    SWTestHelper.checkGetsPrecached({
      url,
      assetLabel: `font ${font} forever`,
      expiry,
      cacheName
    })

    SWTestHelper.checkCacheIsUsed({
      assetLabel: font,
      url,
      expiry,
      mode: 'cors',
      cacheName
    })

  })
});
