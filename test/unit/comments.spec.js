import { proxy } from 'proxyrequire';
import { expect, sinon } from './setup';

const cacheOptions = {
	name: 'comments-v1',
	maxEntries: 20
};

describe('Comments cache', () => {
	const routerStub = { get: sinon.spy() };
	const handlerStub = sinon.stub();
	let commentsCache = {};

	beforeEach(() => {
		routerStub.get = sinon.spy();
		commentsCache = proxy(() => require('../../src/caches/comments'), {
			'../utils/router': routerStub,
		});
		commentsCache.default(handlerStub);
	});

	context('should cache these routes', () => {
		it('GET https://cdn.livefyre.com/*.js', () => {
			expect(routerStub.get).to.have.been.calledWith('/*.js', handlerStub, {
				origin: 'https://cdn.livefyre.com',
				cache: cacheOptions
			});
		});

		it('GET https://cdn.livefyre.com/*.css', () => {
			expect(routerStub.get).to.have.been.calledWith('/*.css', handlerStub, {
				origin: 'https://cdn.livefyre.com',
				cache: cacheOptions
			});
		});

		it('GET https://d3qdfnco3bamip.cloudfront.net/*', () => {
			expect(routerStub.get).to.have.been.calledWith('/*', handlerStub, {
				origin: 'https://d3qdfnco3bamip.cloudfront.net',
				cache: cacheOptions
			});
		});

		it('GET https://*.cloudfront.net/*livefyre*', () => {
			expect(routerStub.get).to.have.been.calledWith('/*livefyre*', handlerStub, {
				origin: 'https://*.cloudfront.net',
				cache: cacheOptions
			});
		});
	});
});
