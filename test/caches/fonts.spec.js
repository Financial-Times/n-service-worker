
describe('fonts', function() {

  it('should precache fonts forever', () => {
    return Promise.all(
      ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular']
      .map(font =>
        SWTestHelper.checkGetsPrecached({
          url: `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.3.0/${font}.woff?`,
          expiry: 'no-expiry',
          cacheName: 'fonts'
        })
      )
    )
  });

  // it('should use cached fonts by default', () => {
    ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'].map(font =>
      SWTestHelper.checkGetsCached({
        assetType: font,
        url: `https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.3.0/${font}.woff?`,
        expiry: 'no-expiry',
        mode: 'cors',
        cacheName: 'fonts'
      }))

      // fetch(`https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.3.0/${font}.woff?`, {
      //   mode: 'cors',
      //   headers: {
      //     'FT-Debug': true
      //   }
      // })
      //   .then(res => {
      //     expect(res.headers.get('from-cache')).to.equal('true');
      //     expect(res.headers.get('expires')).to.equal('no-expiry');
      //   }))

  // });
});
