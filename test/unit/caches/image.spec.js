import { proxy } from 'proxyrequire';
import { expect, sinon } from '../setup';
import { sw as precacheConfig} from '../../../config/precache';
import makeServiceWorkerEnv from 'service-worker-mock';

// Mock the service worker in the global scope to access `self` object.
Object.assign(global, makeServiceWorkerEnv());

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'image-v1'
	}
};

describe('Image cache', () => {
	const routerStub = { get: sinon.spy() };
	const handlerStub = sinon.stub();
	const precacheStub = sinon.stub();
	let imageCache = {};

	beforeEach(() => {
		routerStub.get = sinon.spy();
		imageCache = proxy(() => require('../../../src/caches/image'), {
			'../utils/router': routerStub,
			'../utils/precache': precacheStub
		});
		imageCache.default(handlerStub);
	});


	it('should precache images', () => {
		expect(precacheStub).to.be.calledWith(
			options.cache.name,
			precacheConfig[options.cache.name].map(image => new Request(image)),
			{ maxAge: -1 },
			{ isOptional: true }
		);
	});

	context('should cache these routes', () => {
		it('GET /__origami/service/image/v2/images/raw/fticon*', () => {
			expect(routerStub.get).to.have.been.calledWith(
				'/__origami/service/image/v2/images/raw/fticon*',
				handlerStub,
				options
			);
		});

		it('GET /__origami/service/image/v2/images/raw/ftlogo*', () => {
			expect(routerStub.get).to.have.been.calledWith(
				'/__origami/service/image/v2/images/raw/ftlogo*',
				handlerStub,
				options
			);
		});

		it('GET /__origami/service/image/v2/images/raw/ftsocial*', () => {
			expect(routerStub.get).to.have.been.calledWith(
				'/__origami/service/image/v2/images/raw/ftsocial*',
				handlerStub,
				options
			);
		});

		it('GET /__assets/creatives*', () => {
			expect(routerStub.get).to.have.been.calledWith(
				'/__assets/creatives*',
				handlerStub,
				options
			);
		});
	});
});
