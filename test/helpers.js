/* global expect, SWTestHelper */
import idb from 'idb';
import cache from '../src/utils/cache';
import { passFlags, message } from '../main';

const useragent = require('useragent');

// In firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1302090 means debug headers are not returned
// So we fallback to the dumber method in all but chrome :(
const supportsMutatedHeaders = useragent.is(navigator.userAgent).chrome;

window.SWTestHelper = {
	queryFetchHistory: url => message({type: 'queryFetchHistory', url}),

	clearFetchHistory: url => message({type: 'clearFetchHistory',	url}),

	createNewIframe: function() {
		return new Promise(resolve => {
			var newIframe = document.createElement('iframe');
			newIframe.classList.add('js-test-iframe');
			newIframe.src = '/test-iframe/' + Math.random();
			newIframe.addEventListener('load', () => {
				resolve(newIframe);
			});
			document.body.appendChild(newIframe);
		});
	},

	checkCacheIsUsed: (opts) => {
		if (opts.flag) {
			SWTestHelper._checkCacheIsUsed(Object.assign({}, opts, {message: `should use the cache for ${opts.assetLabel} if ${opts.flag} flag is on`}));
			SWTestHelper._checkCacheNotUsed(Object.assign({}, opts, {message: `should not use the cache for ${opts.assetLabel} if ${opts.flag} flag is off`}));
		} else {
			SWTestHelper._checkCacheIsUsed(Object.assign({}, opts, {message: `should use the cache for ${opts.assetLabel}`}));
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
							.then(wasFetched => expect(wasFetched).to.be.true)
					})
			)
		} else {
			it(message, () =>
				fetch(url, {
					mode
				})
					.then(() => SWTestHelper.queryFetchHistory(url))
					.then(wasFetched => expect(wasFetched).to.be.true)
			)
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
			})

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
										expect(res.headers.get('expires')).to.equal('no-expiry')
									} else {
										expect(res.headers.get('expires')).to.be.below((expireRelativeToInstall ? SWTestHelper.installedAt : Date.now()) + expiry + 10000);
									}
								})
						} else {
							return cache(cacheName)
								.then(cache => cache.get(url))
								.then(res => {
									// alas, we don't get much access to opaque responses
									expect(res).to.exist;
									if (mode === 'cors' || upgradeToCors) {
										expect(res.status).to.equal(200)
									} else {
										expect(res.status).to.equal(0)
									}
								})
						}
					})

			})
			describe('additional network calls', () => {
				beforeEach(() => fetch(url, options))
				if (strategy === 'fastest') {
					it(`should check network for ${assetLabel} in parallel`, () =>
						SWTestHelper.queryFetchHistory(url)
							.then(wasFetched => expect(wasFetched).to.be.true)
					)
				} else {
					it(`should not check network for ${assetLabel}`, () =>
						SWTestHelper.queryFetchHistory(url)
							.then(wasFetched => expect(wasFetched).to.be.false)
					)
				}
			})
		})

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
						expect(res.headers.get('expires')).to.equal('no-expiry')
					} else {
						expect(res.headers.get('expires')).to.be.below(SWTestHelper.installedAt + expiry + 10000);
					}
				})
		})
	},

	resetEnv: function () {
		return Promise.all([
			this.unregisterAllRegistrations(),
			this.clearAllCaches()
		])
		.then(() => {
			var iframeList = document.querySelectorAll('.js-test-iframe');
			for (var i = 0; i < iframeList.length; i++) {
				iframeList[i].parentElement.removeChild(iframeList[i]);
			}
		}).catch()
	},

	unregisterAllRegistrations: function() {
		return navigator.serviceWorker.getRegistrations()
			.then((registrations) => {
				if (registrations.length === 0) {
					return;
				}

				var unregisterPromises = [];
				for (var i = 0; i < registrations.length; i++) {
					unregisterPromises.push(
						registrations[i].unregister()
							.then((success) => {
								if (!success) {
									console.warn('Unable to unregister a SW.');
								} else {
									console.warn('unregister a SW.');
								}
							})
					);
				}
				return Promise.all(unregisterPromises);
			});
	},

	clearAllCaches: function() {
		return window.caches.keys()
			.then((cacheNames) => {
				if (cacheNames.length === 0) {
					return;
				}

				return Promise.all(cacheNames.map(SWTestHelper.clearCache))
			});
	},

	clearCache: function (name) {
		return Promise.all([
			window.caches.delete(name)
				.then((success) => {
					if (!success) {
						throw new Error('Unable to delete cache ' + name);
					}
				}),
			idb.open(name).then(db => {
				try {
					const tx = db.transaction('requests', 'readwrite')
					tx.objectStore('requests').clear()
					return tx.complete;
				} catch (e) {}
			})
		])
	},

	installSW: function(swFile, waitForState = 'activated') {
		return new Promise((resolve, reject) => {
			var options = {scope: './'};
			var iframe = document.querySelector('.js-test-iframe');
			if (iframe) {
				options = {scope: iframe.contentWindow.location.pathname};
			}
			navigator.serviceWorker.getRegistrations()
				.then(registrations => {
					if (registrations.length) {
						throw new Error('service worker already installed.');
					}
				})
				.then(() => navigator.serviceWorker.register(swFile, options))
				.then(registration => {

					function claim (registration) {
						const messageChannel = new MessageChannel();
						// Handler for recieving message reply from service worker
						messageChannel.port1.onmessage = ev => {
							if (ev.data.error) {
								reject(ev.data.error);
							} else {
								resolve();
							}
						};
						// Send message to service worker along with port for reply
						registration.active.postMessage({type: 'claim'}, [messageChannel.port2]);
					}

					// weirdly, when re-registering a service worker that was previously unregistered
					// the installing steps get skipped
					if (registration.active) {
						claim(registration);
					} else if (registration.installing) {
						registration.installing.onstatechange = function() {
							if (this.state === waitForState) {
								if (waitForState === 'activated') {
									navigator.serviceWorker.ready
										.then(claim)
								} else {
									resolve();
								}
							}
						}
					} else {
						reject('No idea what happened')
					}
				})
				.catch((err) => {
					console.log('Error with ' + swFile, err);
					reject(err);
				})


		});
	},

	getAllCachedAssets: function(cacheName) {
		var cache = null;
		return window.caches.keys()
			.then((cacheKeys) => {
				if (cacheKeys.indexOf(cacheName) < 0) {
					throw new Error('Cache doesn\'t exist.');
				}

				return window.caches.open(cacheName);
			})
			.then((openedCache) => {
				cache = openedCache;
				return cache.keys();
			})
			.then((cacheKeys) => {
				return Promise.all(cacheKeys.map((cacheKey) => {
					return cache.match(cacheKey);
				}));
			})
			.then((cacheResponses) => {
				// This method extracts the response streams and pairs
				// them with a url.
				return Promise.all(cacheResponses.map((response) => {
					return response.text().then((text) => {
						return {
							url: response.url,
							text: text
						};
					});
				}));
			})
			.then((responseTexts) => {
				// This converts url, value pairs in an array to an Object
				// of urls with text values. Makes comparisons a little
				// easier in tests
				var output = {};
				for (var i = 0; i < responseTexts.length; i++) {
					var cachedResponse = responseTexts[i];
					output[cachedResponse.url] = cachedResponse.text;
				}
				return output;
			});
	}
};
