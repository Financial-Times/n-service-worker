const expect = chai.expect;
import cache from '../../src/utils/cache';
import { passFlags } from '../../main'
describe('ads', function() {

  it('should precache metadata for sections', () => {
    const expiryLimit = Date.now() + (7 * 60 * 60 * 24 * 1000) + 5000;
    return Promise.all([
      'MQ==-U2VjdGlvbnM=',
      'Mjk=-U2VjdGlvbnM=',
      'NzE=-U2VjdGlvbnM=',
      'MTE2-U2VjdGlvbnM=',
      'MTI1-U2VjdGlvbnM=',
      'MTQ4-U2VjdGlvbnM=',
      'MTQw-U2VjdGlvbnM=',
      'NTQ=-U2VjdGlvbnM=',
      'NTlhNzEyMzMtZjBjZi00Y2U1LTg0ODUtZWVjNmEyYmU1NzQ2-QnJhbmRz' // fastft
    ].map(concept =>
      cache('ads')
        .then(cache => cache.get(`https://ads-api.ft.com/v1/concept/${concept}`, true))
        .then(res => {
          expect(res.headers.get('from-cache')).to.equal('true');
          expect(res.headers.get('expires')).to.be.below(expiryLimit);
        }))
    )
  });

  it('should not use the cache by default', () => {
    return fetch(`https://ads-api.ft.com/v1/concept/MQ==-U2VjdGlvbnM=`, {
      mode: 'cors',
      headers: {
        'FT-Debug': true
      }
    })
      .then(res => {
        expect(res.headers.get('from-cache')).to.not.exist;
      })
  })

  it('should use the cache if flag is on', () => {
    return passFlags({swAdsCaching: true})
      .then(() => {
        console.log('fetch kicked off')
        return fetch(`https://ads-api.ft.com/v1/concept/MQ==-U2VjdGlvbnM=`, {
          mode: 'cors',
          headers: {
            'FT-Debug': true
          }
        })})
        .then(res => {
          expect(res.headers.get('from-cache')).to.equal('true');
        })

  })
});

