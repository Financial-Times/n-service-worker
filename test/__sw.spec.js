import { expect } from 'chai';
import { stub } from 'sinon';
import { purgeCache } from './helpers';
import { proxy } from 'proxyrequire';
import makeServiceWorkerEnv from 'service-worker-mock';


describe('__sw.js', () => {
	beforeEach(() => {
		Object.assign(global, makeServiceWorkerEnv());
		purgeCache('../src/__sw.js');
	});

	it('Should have appropriate event listeners', () => {
		require('../src/__sw.js');
		expect(self.listeners['install']).to.be.ok;
		expect(self.listeners['activate']).to.be.ok;
		expect(self.listeners['fetch']).to.be.ok;
	});

	it('should call clients.claim() on activate event', async () => {
		const cache = { deleteOldCaches: () => {} };

		proxy(() => require('../src/__sw.js'), {
			'./utils/cache': cache
		});

		stub(self.clients, 'claim').callsFake(() => Promise.resolve());
		stub(cache, 'deleteOldCaches').callsFake(() => undefined);

		await self.trigger('activate');

		expect(self.clients.claim.called).is.ok;
	});

	it('should call cache.deleteOldCaches() on activate event', async () => {
		const cache = { deleteOldCaches: () => {} };

		proxy(() => require('../src/__sw.js'), {
			'./utils/cache': cache
		});

		stub(self.clients, 'claim').callsFake(() => Promise.resolve());
		stub(cache, 'deleteOldCaches').callsFake(() => undefined);

		await self.trigger('activate');

		expect(cache.deleteOldCaches.called).is.ok;
	});
});
