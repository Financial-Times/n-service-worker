import { proxy } from 'proxyrequire';
import { expect, sinon } from './setup';
import { sw as precacheConfig} from '../../config/precache';
import makeServiceWorkerEnv from 'service-worker-mock';

// Mock the service worker in the global scope to access `self` object.
Object.assign(global, makeServiceWorkerEnv());

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'fonts-v1',
		maxEntries: 5
	}
};

describe('Fonts cache', () => {
	const routerStub = { get: sinon.spy() };
	const handlerStub = sinon.stub();
	const precacheStub = sinon.stub();
	let fontsCache = {};

	beforeEach(() => {
		routerStub.get = sinon.spy();
		fontsCache = proxy(() => require('../../src/caches/fonts'), {
			'../utils/router': routerStub,
			'../utils/precache': precacheStub
		});
		fontsCache.default(handlerStub);
	});


	it('should precache fonts', () => {
		expect(precacheStub).to.be.calledWith(
			options.cache.name,
			precacheConfig[options.cache.name],
			{ maxAge: -1 },
			{ isOptional: true }
		);
	});

	context('should cache these routes', () => {
		it('GET /__origami/service/build/v2/files/o-fonts-assets@:version/:font.woff', () => {
			expect(routerStub.get).to.have.been.calledWith(
				'/__origami/service/build/v2/files/o-fonts-assets@:version/:font.woff',
				handlerStub,
				options
			);
		});
	});
});
