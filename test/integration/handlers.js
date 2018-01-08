/* global SWTestHelper,SWTestBundles,expect */
const cache = require('../../src/utils/cache').CacheWrapper;
import { passFlags } from '../../main';

const useragent = require('useragent');

// In firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1302090 means debug headers are not returned
// So we fallback to the dumber method in all but chrome :(
const supportsMutatedHeaders = useragent.is(navigator.userAgent).chrome;


const SWTestBundles = {
	checkCacheIsUsed: (opts) => {
		if (opts.flag) {

		} else {
			SWTestBundles._checkCacheIsUsed(Object.assign({}, opts, {message: `should use the cache for ${opts.assetLabel}`}));
		}
	},
	_checkCacheNotUsed: ({message, url, mode = 'no-cors'}) => {

	}
}


describe.only('handlers', () => {


	const flag = 'testCacheFlag';
	const expiry = 'no-expiry';
	const cacheName ='test-cache-v1';
	const fetchOptions = {
		mode: 'cors',
		headers: {
			'FT-Debug': true
		}
	};

	describe('cache first', () => {
		const url = '/__assets/creatives/backgrounds/header-markets-data.png';


		it(`should use the cache, not network, if flag is on`, async () => {
			const flags = {};
			flags[flag] = true;

			await passFlags(flags);
			return fetch(url, fetchOptions)
				.then(() => SWTestHelper.clearFetchHistory(url))
				.then(() => {

					if (supportsMutatedHeaders) {
						return fetch(url, fetchOptions)
							.then(res => {
								expect(res.headers.get('from-cache')).to.equal('true');
							});
					} else {
						return cache(cacheName)
							.then(cache => cache.get(url))
							.then(res => {
								// alas, we don't get much access to opaque responses
								expect(res).to.exist;
								expect(res.status).to.equal(200);
							});
					}
				})
				.then(() => {
					return SWTestHelper.queryFetchHistory(url)
						.then(wasFetched => expect(wasFetched).to.be.false)
				});

		});

		it(`should use the network if flag is off`, async () => {
			const flags = {};
			flags[flag] = false;
			await passFlags(flags);

			return fetch(url, fetchOptions)
				.then(res => {
					expect(res.headers.get('from-cache')).to.not.exist;
					return SWTestHelper.queryFetchHistory(url)
						.then(wasFetched => expect(wasFetched).to.be.true);
				})

		});

	});

	describe('fastest', () => {
		const url = '/__origami/service/image/v2/images/raw/ftlogo:brand-nikkei-tagline?source=sw-test';

		it.only(`should use the cache, with network in parallel, if flag is on`, async () => {
			const flags = {};
			flags[flag] = true;

			await passFlags(flags);
			return fetch(url, fetchOptions)
				.then(() => SWTestHelper.clearFetchHistory(url))
				// when using fastest strategy the cache is not populated before the sw responds
				// so we introduce a delay
				.then(() => new Promise(res => setTimeout(res, 500)))
				.then(() => {

					if (supportsMutatedHeaders) {
						return fetch(url, fetchOptions)
							.then(res => {
								// debugger;
								expect(res.headers.get('from-cache')).to.equal('true');
							});
					} else {
						return cache(cacheName)
							.then(cache => cache.get(url))
							.then(res => {
								// alas, we don't get much access to opaque responses
								expect(res).to.exist;
								expect(res.status).to.equal(200);
							});
					}
				})
				.then(() => {
					return SWTestHelper.queryFetchHistory(url)
						.then(wasFetched => expect(wasFetched).to.be.true)
				});

		});

		it(`should use the network if flag is off`, async () => {
			const flags = {};
			flags[flag] = false;
			await passFlags(flags);

			return fetch(url, fetchOptions)
				.then(res => {
					expect(res.headers.get('from-cache')).to.not.exist;
					return SWTestHelper.queryFetchHistory(url)
						.then(wasFetched => expect(wasFetched).to.be.true);
				})

		});



						// if (strategy === 'fastest') {
				// 	it(`should check network for ${assetLabel} in parallel`, () =>
				// 		SWTestHelper.queryFetchHistory(url)
				// 			.then(wasFetched => expect(wasFetched).to.be.true)
				// 	);
				// } else {
	});
})
