/* global SWTestHelper,SWTestBundles,expect */
import cache from '../src/utils/cache';
import { passFlags } from '../main';

const useragent = require('useragent');

// In firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1302090 means debug headers are not returned
// So we fallback to the dumber method in all but chrome :(
const supportsMutatedHeaders = useragent.is(navigator.userAgent).chrome;

window.SWTestBundles = {
	checkCacheIsUsed: (opts) => {
		if (opts.flag) {
			SWTestBundles._checkCacheIsUsed(Object.assign({}, opts, {message: `should use the cache for ${opts.assetLabel} if ${opts.flag} flag is on`}));
			SWTestBundles._checkCacheNotUsed(Object.assign({}, opts, {message: `should not use the cache for ${opts.assetLabel} if ${opts.flag} flag is off`}));
		} else {
			SWTestBundles._checkCacheIsUsed(Object.assign({}, opts, {message: `should use the cache for ${opts.assetLabel}`}));
		}
	},
	_checkCacheNotUsed: ({message, url, mode = 'no-cors'}) => {
		if (mode === 'cors' && supportsMutatedHeaders) {
			it(message, () =>
				fetch(url, {
					mode,
					headers: {
						'FT-Debug': true
					}
				})
					.then(res => {
						expect(res.headers.get('from-cache')).to.not.exist;
						return SWTestHelper.queryFetchHistory(url)
							.then(wasFetched => expect(wasFetched).to.be.true);
					})
			);
		} else {
			it(message, () =>
				fetch(url, {
					mode
				})
					.then(() => SWTestHelper.queryFetchHistory(url))
					.then(wasFetched => expect(wasFetched).to.be.true)
			);
		}

	},

	_checkCacheIsUsed: ({message, assetLabel, url, expiry, mode = 'no-cors', cacheName, flag, upgradeToCors, expireRelativeToInstall, strategy}) => {


		describe(assetLabel, () => {
			const options = {mode};
			if ((mode === 'cors' || upgradeToCors) && supportsMutatedHeaders) {
				options.headers = {'FT-Debug': true};
			}

			beforeEach(() => {
				let kickoff = Promise.resolve();
				if (flag) {
					const flags = {};
					flags[flag] = true;
					kickoff = passFlags(flags);
				}
				return kickoff;
			});

			it(message, () => {
				return fetch(url, options)
					.then(() => SWTestHelper.clearFetchHistory(url))
					// when using fastest strategy the cache is not populated before the sw responds
					// so we introduce a delay
					.then(() => new Promise(res => strategy === 'fastest' ? setTimeout(res, 100) : res()))
					.then(() => {

						if (mode === 'cors' && supportsMutatedHeaders) {
							return fetch(url, options)
								.then(res => {
									expect(res.headers.get('from-cache')).to.equal('true');
									if (expiry === 'no-expiry') {
										expect(res.headers.get('expires')).to.equal('no-expiry');
									} else {
										expect(res.headers.get('expires')).to.be.below((expireRelativeToInstall ? SWTestHelper.installedAt : Date.now()) + expiry + 10000);
									}
								});
						} else {
							return cache(cacheName)
								.then(cache => cache.get(url))
								.then(res => {
									// alas, we don't get much access to opaque responses
									expect(res).to.exist;
									if (mode === 'cors' || upgradeToCors) {
										expect(res.status).to.equal(200);
									} else {
										expect(res.status).to.equal(0);
									}
								});
						}
					});

			});
			describe('additional network calls', () => {
				beforeEach(() => fetch(url, options));
				if (strategy === 'fastest') {
					it(`should check network for ${assetLabel} in parallel`, () =>
						SWTestHelper.queryFetchHistory(url)
							.then(wasFetched => expect(wasFetched).to.be.true)
					);
				} else {
					it(`should not check network for ${assetLabel}`, () =>
						SWTestHelper.queryFetchHistory(url)
							.then(wasFetched => expect(wasFetched).to.be.false)
					);
				}
			});
		});

	},

	checkGetsPrecached: ({assetLabel, url, expiry, cacheName}) => {
		it(`should precache ${assetLabel}`, () => {
			return cache(cacheName)
				.then(cache => cache.get(url, true))
				.then(res => {
					SWTestHelper.clearFetchHistory(url);
					return res;
				})
				.then(res => {
					expect(res.headers.get('from-cache')).to.equal('true');
					if (expiry === 'no-expiry') {
						expect(res.headers.get('expires')).to.equal('no-expiry');
					} else {
						expect(res.headers.get('expires')).to.be.below(SWTestHelper.installedAt + expiry + 10000);
					}
				});
		});
	}
};
