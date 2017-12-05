import { expect, sinon } from './setup';
import { purgeModuleCache } from './helpers';
import { proxy } from 'proxyrequire';
import makeServiceWorkerEnv from 'service-worker-mock';


describe('__sw.js', () => {
	beforeEach(() => {
		Object.assign(global, makeServiceWorkerEnv());
		purgeModuleCache('../../src/__sw.js');
	});

	it('Should have appropriate event listeners', () => {
		require('../../src/__sw.js');
		expect(self.listeners['install']).to.be.ok;
		expect(self.listeners['activate']).to.be.ok;
		expect(self.listeners['fetch']).to.be.ok;
	});

	it('should call clients.claim() on activate event', async () => {
		require('../../src/__sw.js');
		sinon.stub(self.clients, 'claim').callsFake(() => Promise.resolve());
		await self.trigger('activate');
		expect(self.clients.claim.called).is.ok;
	});

	it('should expire caches on install event', async () => {
		require('../../src/__sw.js');
		const cache = require('../../src/utils/cache');
		sinon.stub(cache, 'checkAndExpireAllCaches').callsFake(() => Promise.resolve());
		await self.trigger('install');
		expect(cache.checkAndExpireAllCaches.calledWith(caches)).to.be.true;
	});

	context('Register and initialise caches', () => {
		let adsCacheStub = {};
		let fontsCacheStub = {};
		let imageCacheStub = {};
		let builtAssetsCacheStub = {};
		let polyfillCacheStub = {};
		let commentsCacheStub = {};
		let myFtCacheStub = {};

		beforeEach(() => {
			adsCacheStub = sinon.stub();
			fontsCacheStub = sinon.stub();
			imageCacheStub = sinon.stub();
			builtAssetsCacheStub = sinon.stub();
			polyfillCacheStub = sinon.stub();
			commentsCacheStub = sinon.stub();
			myFtCacheStub = sinon.stub();

			proxy(() => require('../../src/__sw.js'), {
				'./caches/ads': adsCacheStub,
				'./caches/fonts': fontsCacheStub ,
				'./caches/image': imageCacheStub,
				'./caches/built-assets': builtAssetsCacheStub,
				'./caches/polyfill': polyfillCacheStub,
				'./caches/comments': commentsCacheStub,
				'./caches/myft': myFtCacheStub
			});
		});

		it('Ads cache', () => {
			expect(adsCacheStub).to.have.been.called;
		});

		it('Fonts cache', () => {
			expect(fontsCacheStub).to.have.been.called;
		});

		it('Image cache', () => {
			expect(imageCacheStub).to.have.been.called;
		});

		it('Built assets cache', () => {
			expect(builtAssetsCacheStub).to.have.been.called;
		});

		it('Polyfill cache', () => {
			expect(polyfillCacheStub).to.have.been.called;
		});

		it('Comments cache', () => {
			expect(commentsCacheStub).to.not.have.been.called;
		});

		it('MyFT cache', () => {
			expect(myFtCacheStub).to.not.have.been.called;
		});
	});
});
