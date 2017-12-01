import { proxy } from 'proxyrequire';
import { expect, sinon } from './setup';
import makeServiceWorkerEnv from 'service-worker-mock';

// Mock the service worker in the global scope to access `self` object.
Object.assign(global, makeServiceWorkerEnv());

const options = {
	origin: self.host || 'https://www.ft.com',
	cache: {
		name: 'myft-v1',
		maxAge: 60 * 60 * 12
	}
};

describe('MyFT cache', () => {
	const registerCacheStub = sinon.spy();
	const purgeCacheStub = sinon.spy();
	const routerStub = {
		get: sinon.spy(),
		put: sinon.spy(),
		post: sinon.spy(),
		delete: sinon.spy()
	};
	const handlerStub = sinon.stub();
	let commentsCache = {};

	beforeEach(() => {
		routerStub.get = sinon.spy();
		commentsCache = proxy(() => require('../../src/caches/myft'), {
			'../utils/router': routerStub,
			'../utils/personal': { registerCache: registerCacheStub },
			'../utils/purgeCache': { purgeCache: purgeCacheStub }
		});
		commentsCache.default(handlerStub);
	});

	it('should register the personal MyFT cache', () => {
		expect(registerCacheStub).to.have.been.calledWith('next:myft-v1');
	});

	context('should cache these routes', () => {
		it('GET /__myft/api/*', () => {
			expect(routerStub.get).to.have.been.calledWith(
				'/__myft/api/*',
				handlerStub,
				options
			);
		});

		it('PUT /__myft/api/*', () => {
			expect(routerStub.put).to.have.been.calledWith(
				'/__myft/api/*',
				purgeCacheStub
			);
		});

		it('POST /__myft/api/*', () => {
			expect(routerStub.post).to.have.been.calledWith(
				'/__myft/api/*',
				purgeCacheStub
			);
		});

		it('DELETE /__myft/api/*', () => {
			expect(routerStub.delete).to.have.been.calledWith(
				'/__myft/api/*',
				purgeCacheStub
			);
		});
	});
});
