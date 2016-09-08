const expect = chai.expect;

import { passFlags } from '../../main'
describe('ads', function() {

	it('should precache metadata for sections', () => {
		const oninstallExpiryLimit = window.installedAt + (7 * 60 * 60 * 24 * 1000) + 5000;
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
			SWTestHelper.checkGetsPrecached(`https://ads-api.ft.com/v1/concept/${concept}`, oninstallExpiryLimit, 'ads')
		))
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
	describe('retrieving from cache', () => {
		beforeEach(() => passFlags({swAdsCaching: true}))

		it('should use the sections cache if flag is on', () => {
			return fetch(`https://ads-api.ft.com/v1/concept/MQ==-U2VjdGlvbnM=`, {
				mode: 'cors',
				headers: {
					'FT-Debug': true
				}
			})
			.then(res => {
				expect(res.headers.get('from-cache')).to.equal('true');
			})
		});

		[
			['streams', 'https://ads-api.ft.com/v1/concept/MTM4-U2VjdGlvbnM=', 7, 'cors'],
			['google tag library', 'https://www.googletagservices.com/tag/js/gpt.js', 7, 'no-cors'],
			['google stuff', 'https://partner.googleadservices.com/gpt/pubads_impl_95.js', 30, 'no-cors'],
			['more google stuff', 'https://pagead2.googlesyndication.com/pagead/osd.js', 1, 'no-cors'],
			['yet more google stuff', 'https://tpc.googlesyndication.com/safeframe/1-0-4/html/container.html', 1/24, 'no-cors'],
			['krux tag', 'https://cdn.krxd.net/controltag/KHUSeE3x.js', 7, 'no-cors'],
			['krux lib', 'https://cdn.krxd.net/ctjs/controltag.js.d4d7fc61dff29ba846cb4a9ffc42cbf9', 30, 'no-cors'],
		].forEach(([type, url, expiry, mode]) => {
			it(`should use the cache for ${type} if flag is on`, () => {
				const expiryLimit = Date.now() + (expiry * 60 * 60 * 24 * 1000) + 5000;
				return SWTestHelper.checkGetsCached(url, expiryLimit, mode, 'ads');
			})
		})

	})

// toolbox.router.get('/userdata/*', cacheFirstFlagged('swAdsCaching'), {
// 	origin: 'https://cdn.krxd.net',
// 	cache: getCacheOptions(1, true)
// });

// toolbox.router.get('/v1/user', cacheFirstFlagged('swAdsCaching'), {
// 	origin: 'https://ads-api.ft.com',
// 	cache: getCacheOptions(7, true)
// });

});

