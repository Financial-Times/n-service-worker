/* global expect,SWTestHelper */
import cache from '../../src/utils/cache';
import DB from '../../src/utils/db';
import fetchMock from 'fetch-mock';

describe('cache', () => {
	// before(() => SWTestHelper.resetEnv());

	before(() => SWTestHelper.clearAllCaches().catch(() => null));
	afterEach(() => SWTestHelper.clearAllCaches().catch(() => null));

	describe('putting items in the cache', () => {

		it('put a Request in the cache', () => {
			const testUrl = 'http://localhost:9876/files/0';
			return cache('test-cache')
				.then(cache => cache.set(new Request(testUrl)))
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(inCache instanceof Response).to.be.true;
					expect(inCache.url).to.equal(testUrl)
					expect(inDb.expires).to.exist
				})

		});

		it('put a url in the cache', () => {
			const testUrl = 'http://localhost:9876/files/1';
			return cache('test-cache')
				.then(cache => cache.set(testUrl))
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(inCache instanceof Response).to.be.true;
					expect(inCache.url).to.equal(testUrl)
					expect(inDb.expires).to.exist
				})
		});

		it('put a request in the cache when a response provided', () => {
			const testUrl = 'http://localhost:9876/files/x';
			fetchMock.mock(/.*/, url => fetchMock.realFetch.bind(window)(url));

			return cache('test-cache')
				.then(cache => cache.set(testUrl, {
					response: new Response('I am synthetic')
				}))
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(fetchMock.called()).to.be.false;
					fetchMock.restore()

					expect(inCache instanceof Response).to.be.true;
					expect(inDb.expires).to.exist
					return inCache.text()
						.then(text => {
							expect(text).to.equal('I am synthetic')
						})
				})
		});

		it('not put bad responses in the cache', () => {
			const testUrl = 'http://localhost:9876/files/404';
			return cache('test-cache')
				.then(cache => cache.set(testUrl))
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(inCache).to.not.exist;
					expect(inDb).to.not.exist
				})
		})

		it('not put synthetic bad responses in the cache', () => {
			const testUrl = 'http://localhost:9876/files/503';
			return cache('test-cache')
				.then(cache => cache.set(testUrl, new Response('not found', {
					status: 503
				})))
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(inCache).to.not.exist;
					expect(inDb).to.not.exist
				})
		})

		it('overwrite an item in the cache', () => {
			const testUrl = 'http://localhost:9876/files/4';
			return cache('test-cache')
				.then(cache => {
					return cache.set(testUrl)
						.then(() => cache);
				})
				.then(cache => cache.set(testUrl, {
					response: new Response('I am overwritten with synthetic')
				}))
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(inCache instanceof Response).to.be.true;
					expect(inDb.expires).to.exist
					return inCache.text()
						.then(text => {
							expect(text).to.equal('I am overwritten with synthetic')
						})
				})
		});

	})

	describe('getting items from the cache', () => {
		it('get a request from the cache', () => {
			const testUrl = 'http://localhost:9876/files/0';
			return cache('test-cache')
				.then(cache => {
					return cache.set(testUrl)
						.then(() => {
							fetchMock.mock(/.*/, url => fetchMock.realFetch.bind(window)(url));
							return cache
						});
				})
				.then(cache => cache.get(new Request(testUrl)))
				.then(response => {
					expect(fetchMock.called()).to.be.false;
					fetchMock.restore();
					expect(response instanceof Response).to.be.true;
					expect(response.url).to.equal(testUrl)
				})
		});

		it('get a url from the cache', () => {
			const testUrl = 'http://localhost:9876/files/0';

			return cache('test-cache')
				.then(cache => {
					return cache.set(new Request(testUrl))
						.then(() => {
							fetchMock.mock(/.*/, url => fetchMock.realFetch.bind(window)(url));
							return cache
						});
				})
				.then(cache => cache.get(testUrl))
				.then(response => {
					expect(fetchMock.called()).to.be.false;
					fetchMock.restore();
					expect(response instanceof Response).to.be.true;
					expect(response.url).to.equal(testUrl)
				})
		});

		it('getOrSet a request from the cache if present', () => {
			const testUrl = 'http://localhost:9876/files/0';

			return cache('test-cache')
				.then(cache => {
					return cache.set(new Request(testUrl))
						.then(() => {
							fetchMock.mock(/.*/, url => fetchMock.realFetch.bind(window)(url));
							return cache
						});
				})
				.then(cache => cache.getOrSet(testUrl))
				.then(response => {
					expect(fetchMock.called()).to.be.false;
					fetchMock.restore();
					expect(response instanceof Response).to.be.true;
					expect(response.url).to.equal(testUrl)
				});
		});

		it('getOrSet a request from the network if not present in cache', () => {
			const testUrl = 'http://localhost:9876/files/0';
			fetchMock.mock(/.*/, url => fetchMock.realFetch.bind(window)(url));

			return cache('test-cache')
				.then(cache => cache.getOrSet(testUrl))
				.then(response => {
					expect(fetchMock.called()).to.be.true;
					fetchMock.restore();
					expect(response instanceof Response).to.be.true;
					expect(response.url).to.equal(testUrl)
				})
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(inCache instanceof Response).to.be.true;
					expect(inCache.url).to.equal(testUrl)
					expect(inDb.expires).to.exist
				});
		});

	});


	describe('deleting from and managing the cache', () => {

		it('delete a request from the cache', () => {
			const testUrl = 'http://localhost:9876/files/0';

			return cache('test-cache')
				.then(cache => {
					return cache.set(new Request(testUrl))
						.then(() => cache);
				})
				.then(cache => cache.delete(new Request(testUrl)))
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(inCache).to.not.exist;
					expect(inDb).to.not.exist;
				})
		});

		it('delete a url from the cache', () => {
			const testUrl = 'http://localhost:9876/files/0';

			return cache('test-cache')
				.then(cache => {
					return cache.set(new Request(testUrl))
						.then(() => cache);
				})
				.then(cache => cache.delete(testUrl))
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match(testUrl)),
					new DB('requests', { dbName: 'next:test-cache'})
						.get(testUrl)
				]))
				.then(([inCache, inDb]) => {
					expect(inCache).to.not.exist;
					expect(inDb).to.not.exist;
				})
		});

		it('get a list of all keys in the cache', () => {
			return cache('test-cache')
				.then(cache => {
					return Promise.all([
						cache.set('http://localhost:9876/files/0'),
						cache.set(new Request('http://localhost:9876/files/1'))
					])
						.then(() => cache);
				})
				.then(cache => cache.keys())
				.then(keys => keys.map(k => k.url))
				.then(keys => {
					expect(keys.length).to.equal(2);
					expect(keys).to.contain('http://localhost:9876/files/0')
					expect(keys).to.contain('http://localhost:9876/files/1')
				})
		});

		it('clear all keys in the cache', () => {
			return cache('test-cache')
				.then(cache => {
					return Promise.all([
						cache.set('http://localhost:9876/files/0'),
						cache.set(new Request('http://localhost:9876/files/1'))
					])
						.then(() => cache);
				})
				.then(cache => cache.clear())
				.then(() => Promise.all([
					caches.open('next:test-cache')
						.then(cache => cache.match('http://localhost:9876/files/0')),
					new DB('requests', { dbName: 'next:test-cache'})
						.get('http://localhost:9876/files/0'),
					caches.open('next:test-cache')
						.then(cache => cache.match('http://localhost:9876/files/1')),
					new DB('requests', { dbName: 'next:test-cache'})
						.get('http://localhost:9876/files/1')
				]))
				.then(([inCache1, inDb1, inCache2, inDb2]) => {
					expect(inCache1).to.not.exist;
					expect(inDb1).to.not.exist;
					expect(inCache2).to.not.exist;
					expect(inDb2).to.not.exist;
				})
		});
	})


	describe('cache invalidation', () => {
		describe('max entries', () => {
			it('set an item in cache limited by size', () => {
				return cache('test-cache')
					.then(cache => {
						return Promise.all([
							cache.set('http://localhost:9876/files/0'),
							cache.set('http://localhost:9876/files/1')
						])
						.then(() => cache.set('http://localhost:9876/files/2', {maxEntries: 2}))
						.then(() => cache.keys())
						.then(keys => keys.map(k => k.url))
						.then(keys => {
							expect(keys.length).to.equal(3);
							expect(keys).to.contain('http://localhost:9876/files/0')
							expect(keys).to.contain('http://localhost:9876/files/1')
							expect(keys).to.contain('http://localhost:9876/files/2')
						})
						// cache invalidation is done lazily so we add a delay
						.then(() => new Promise(res => setTimeout(res, 500)))
						.then(() => Promise.all([
							cache.keys(),
							caches.open('next:test-cache')
								.then(cache => cache.match('http://localhost:9876/files/0')),
							new DB('requests', { dbName: 'next:test-cache'})
								.get('http://localhost:9876/files/0'),
							caches.open('next:test-cache')
								.then(cache => cache.match('http://localhost:9876/files/2')),
							new DB('requests', { dbName: 'next:test-cache'})
								.get('http://localhost:9876/files/2')
						]))
						.then(([keys, inCache1, inDb1, inCache2, inDb2]) => {

							keys = keys.map(k => k.url)
							expect(keys.length).to.equal(2);
							expect(keys).to.contain('http://localhost:9876/files/1')
							expect(keys).to.contain('http://localhost:9876/files/2')
							expect(inCache1).to.not.exist;
							expect(inDb1).to.not.exist;
							expect(inCache2).to.exist;
							expect(inDb2).to.exist;
						})
					})
			});
		});
		describe('max age', () => {
			it('default to 60s expiry', () => {
				const now = Date.now();
				const testUrl = 'http://localhost:9876/files/0';
				return cache('test-cache')
					.then(cache => cache.set(testUrl))
					.then(() => new DB('requests', { dbName: 'next:test-cache'}).get(testUrl))
					.then(inDb => {
						expect(inDb.expires).to.be.closeTo(now + (60 * 1000), 500)
					})
			})

			it('possible to set no expiry', () => {
				const testUrl = 'http://localhost:9876/files/0';
				return cache('test-cache')
					.then(cache => cache.set(testUrl, {maxAge: -1}))
					.then(() => new DB('requests', { dbName: 'next:test-cache'}).get(testUrl))
					.then(inDb => {
						expect(inDb).to.not.exist
					})
			})

			it('possible to set custom expiry', () => {
				const now = Date.now();
				const testUrl = 'http://localhost:9876/files/0';
				return cache('test-cache')
					.then(cache => cache.set(testUrl, {maxAge: 200}))
					.then(() => new DB('requests', { dbName: 'next:test-cache'}).get(testUrl))
					.then(inDb => {
						expect(inDb.expires).to.be.closeTo(now + (200 * 1000), 500)
					})
			})

			it('possible to overwrite custom expiry', () => {
				const now = Date.now();
				const testUrl = 'http://localhost:9876/files/0';
				return cache('test-cache')
					.then(cache => {
						return cache.set(testUrl, {maxAge: 200})
							.then(() => cache)
					})
					.then(cache => cache.set(testUrl))
					.then(() => new DB('requests', { dbName: 'next:test-cache'}).get(testUrl))
					.then(inDb => {
						expect(inDb.expires).to.be.closeTo(now + (60 * 1000), 500)
					})
			})

			it('invalidate cache items when past expiry', () => {
				const testUrl = 'http://localhost:9876/files/0';
				return cache('test-cache')
					.then(cache => {
						return cache.set(testUrl)
							// force an earlier expiry
							.then(() => new DB('requests', { dbName: 'next:test-cache'}).set(testUrl, {expires: Date.now() - 2000}))
							.then(() => cache.get(testUrl))
							.then(res => expect(res).to.not.exist)
					});
			});

			it('invalidate expired items lazily when opening cache', () => {
				const testUrl = 'http://localhost:9876/files/0';
				return cache('test-cache')
					.then(cache => {
						return cache.set(testUrl)
							// force an earlier expiry
							.then(() => new DB('requests', { dbName: 'next:test-cache'}).set(testUrl, {expires: Date.now() - 2000}))
							.then(() => Promise.all([
								caches.open('next:test-cache')
									.then(cache => cache.match(testUrl)),
								new DB('requests', { dbName: 'next:test-cache'})
									.get(testUrl)
							]))
							.then(([inCache, inDb]) => {
								expect(inCache).to.exist;
								expect(inDb).to.exist
							})
					})
					.then(() => cache('test-cache'))
					// cache invalidation is done lazily so we add a delay
					.then(() => new Promise(res => setTimeout(res, 500)))
					.then(() => Promise.all([
						caches.open('next:test-cache')
							.then(cache => cache.match(testUrl)),
						new DB('requests', { dbName: 'next:test-cache'})
							.get(testUrl)
					]))
					.then(([inCache, inDb]) => {
						expect(inCache).to.not.exist;
						expect(inDb).to.not.exist
					})
			})
		});
	})

	describe('perf', () => {
		// TODOD: expectations about not blocking network requests with idb/cache requests
	})

})
