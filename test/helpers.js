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

	resetEnv: function () {
		return Promise.all([
			this.unregisterAllRegistrations(),
			this.clearAllCaches()
		])
		.then(() => {
			const iframeList = document.querySelectorAll('.js-test-iframe');
			for (let i = 0; i < iframeList.length; i++) {
				iframeList[i].parentElement.removeChild(iframeList[i]);
			}
		}).catch()
	},

	unregisterAllRegistrations: function () {
		return navigator.serviceWorker.getRegistrations()
			.then((registrations) => {
				if (registrations.length === 0) {
					return;
				}

				const unregisterPromises = [];
				for (let i = 0; i < registrations.length; i++) {
					unregisterPromises.push(
						registrations[i].unregister()
							.then((success) => {
								if (!success) {
									console.warn('Unable to unregister a SW.'); //eslint-disable-line
								} else {
									console.warn('unregistered a SW.');  //eslint-disable-line
								}
							})
					);
				}
				return Promise.all(unregisterPromises);
			});
	},

	clearAllCaches: function () {
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

	installSW: function (swFile, waitForState = 'activated') {
		return new Promise((resolve, reject) => {
			let options = {scope: './'};
			const iframe = document.querySelector('.js-test-iframe');
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
						registration.installing.onstatechange = function () {
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
						reject('Unexpected failure - try clearing all caches and db\'s in the browser')
					}
				})
				.catch((err) => {
					console.log('Error with ' + swFile, err);  //eslint-disable-line
					reject(err);
				})
		});
	},

	getAllCachedAssets: function (cacheName) {
		let cache = null;
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
				const output = {};
				for (let i = 0; i < responseTexts.length; i++) {
					const cachedResponse = responseTexts[i];
					output[cachedResponse.url] = cachedResponse.text;
				}
				return output;
			});
	}
};
