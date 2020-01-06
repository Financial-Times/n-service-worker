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
		const cache = { deleteOldCaches: () => {} };

		proxy(() => require('../../src/__sw.js'), {
			'./utils/cache': cache
		});

		sinon.stub(self.clients, 'claim').callsFake(() => Promise.resolve());
		sinon.stub(cache, 'deleteOldCaches').callsFake(() => undefined);

		await self.trigger('activate');

		expect(self.clients.claim.called).is.ok;
	});

	it('should expire caches on install event', async () => {
		const cache = { deleteOldCaches: () => {} };

		proxy(() => require('../../src/__sw.js'), {
			'./utils/cache': cache
		});

		sinon.stub(self.clients, 'claim').callsFake(() => Promise.resolve());
		sinon.stub(cache, 'deleteOldCaches').callsFake(() => undefined);

		await self.trigger('activate');

		expect(cache.deleteOldCaches.called).is.ok;
	});

	context('Register and initialise caches', () => {
		let fontsCacheStub = {};
		let imageCacheStub = {};
		let builtAssetsCacheStub = {};
		let polyfillCacheStub = {};
		let commentsCacheStub = {};
		let myFtCacheStub = {};

		beforeEach(() => {
			fontsCacheStub = sinon.stub();
			imageCacheStub = sinon.stub();
			builtAssetsCacheStub = sinon.stub();
			polyfillCacheStub = sinon.stub();
			commentsCacheStub = sinon.stub();
			myFtCacheStub = sinon.stub();

			proxy(() => require('../../src/__sw.js'), {
				'./caches/fonts': fontsCacheStub ,
				'./caches/image': imageCacheStub,
				'./caches/built-assets': builtAssetsCacheStub,
				'./caches/polyfill': polyfillCacheStub,
				'./caches/comments': commentsCacheStub,
				'./caches/myft': myFtCacheStub
			});
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
