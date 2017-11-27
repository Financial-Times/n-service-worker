/*global expect, sinon */
import { expect } from 'chai';
import { stub } from 'sinon';
import { purgeCache } from './helpers';
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
		require('../src/__sw.js');
		stub(self.clients, 'claim').callsFake(() => Promise.resolve());
		await self.trigger('activate');
		expect(self.clients.claim.called).is.ok;
	});

	it('should expire caches on install event', async () => {
		require('../src/__sw.js');
		const cache = require('../src/utils/cache');
		stub(cache, 'checkAndExpireAllCaches').callsFake(() => Promise.resolve());
		await self.trigger('install');
		expect(cache.checkAndExpireAllCaches.calledWith(caches)).to.be.true;
	});
});
