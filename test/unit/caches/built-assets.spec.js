import { proxy } from 'proxyrequire';
import { expect, sinon } from '../setup';
import makeServiceWorkerEnv from 'service-worker-mock';

// Mock the service worker in the global scope to access `self` object.
Object.assign(global, makeServiceWorkerEnv());

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'built-assets-v1',
		maxEntries: 30,
		// our code base moves so fast, pointless caching enything longer than a few days
		maxAge: 60 * 60 * 24 * 14
	}
};

describe('Built assets cache', () => {
	const flagsStub = sinon.spy();
	const routerStub = { get: sinon.spy() };
	const handlerStub = sinon.stub();
	let builtAssetsCaches = {};

	beforeEach(() => {
		routerStub.get = sinon.spy();
		builtAssetsCaches = proxy(() => require('../../../src/caches/built-assets'), {
			'../utils/flags': flagsStub,
			'../utils/router': routerStub,
		});
		builtAssetsCaches.default(handlerStub);
	});

	context('should cache these routes', () => {
		it('GET /__assets/hashed/:appName/:assetHash/:cssName.css', () => {
			expect(routerStub.get).to.have.been.calledWith('/__assets/hashed/:appName/:assetHash/:cssName.css', handlerStub, options);
		});

		it('GET /__assets/hashed/:appName/:assetHash/:cssName.js', () => {
			expect(routerStub.get).to.have.been.calledWith('/__assets/hashed/:appName/:assetHash/:cssName.js', handlerStub, options);
		});
	});
});
