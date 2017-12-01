import { proxy } from 'proxyrequire';
import { expect, sinon } from './setup';
import makeServiceWorkerEnv from 'service-worker-mock';

// Mock the service worker in the global scope to access `self` object.
Object.assign(global, makeServiceWorkerEnv());

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'polyfill-v1',
		maxEntries: 4
	}
};

describe('Polyfill cache', () => {
	const routerStub = { get: sinon.spy() };
	const handlerStub = sinon.stub();
	let commentsCache = {};

	beforeEach(() => {
		routerStub.get = sinon.spy();
		commentsCache = proxy(() => require('../../src/caches/polyfill'), {
			'../utils/router': routerStub,
		});
		commentsCache.default(handlerStub);
	});

	context('should cache these routes', () => {
		it('GET /__origami/service/polyfill/*', () => {
			expect(routerStub.get).to.have.been.calledWith(
				'/__origami/service/polyfill/*',
				handlerStub,
				options
			);
		});
	});
});
