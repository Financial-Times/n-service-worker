const expect = chai.expect;
import cache from '../../src/utils/cache';

describe('fonts', function() {

  it('should precache fonts forever', () => {
    return Promise.all(
      ['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular']
      .map(font =>
        SWTestHelper.checkGetsPrecached(`https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.3.0/${font}.woff?`, 'no-expiry', 'fonts')
      )
    )
  });

  it('should use cached fonts by default', () => {
    return Promise.all(['MetricWeb-Regular', 'MetricWeb-Semibold', 'FinancierDisplayWeb-Regular'].map(font =>
      fetch(`https://next-geebee.ft.com/build/v2/files/o-fonts-assets@1.3.0/${font}.woff?`, {
        mode: 'cors',
        headers: {
          'FT-Debug': true
        }
      })
        .then(res => {
          expect(res.headers.get('from-cache')).to.equal('true');
          expect(res.headers.get('expires')).to.equal('no-expiry');
        }))
    )
  });
});
