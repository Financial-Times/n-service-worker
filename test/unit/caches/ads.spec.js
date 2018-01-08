import { proxy } from 'proxyrequire';
import { expect, sinon } from '../setup';

function getCacheOptions (days, isPersonal) {
	return {
		name: 'ads' + (isPersonal ? ':personal' : '') + '-v1',
		maxAge: 60 * 60 * (days >= 1 ? days * 24 : 1),
		maxEntries: 60
	};
}

describe('Ads cache', () => {
	const registerCacheStub = sinon.spy();
	const routerStub = { get: sinon.spy() };
	const precacheStub = sinon.stub();
	let adsCaches = {};
	const handlerStub = sinon.stub();

	beforeEach(() => {
		routerStub.get = sinon.spy();
		adsCaches = proxy(() => require('../../../src/caches/ads'), {
			'../utils/personal': { registerCache: registerCacheStub },
			'../utils/router': routerStub,
			'../utils/precache': precacheStub
		});
		adsCaches.default(handlerStub);
	});

	it('should register the personal ads cache', () => {
		expect(registerCacheStub).to.have.been.calledWith('next:ads:personal-v1');
	});

	it('should precache the top topSections', () => {
		const sevenDays = 60 * 60 * 7 * 24;
		expect(precacheStub).to.be.calledWith(
			'ads-v1',
			adsCaches.topSections.map(section => `https://ads-api.ft.com/v1/concept/${section}`),
			{ maxAge: sevenDays, maxEntries: 60 },
			{ isOptional: true }
		);
	});

	context('should cache these routes', () => {
		it('GET https://ads-api.ft.com/v1/user', () => {
			expect(routerStub.get).to.have.been.calledWith('/v1/user', handlerStub, {
				origin: 'https://ads-api.ft.com',
				cache: getCacheOptions(7, true)
			});
		});

		it('GET https://cdn.krxd.net/userdata/*', () => {
			expect(routerStub.get).to.have.been.calledWith('/userdata/*', handlerStub, {
				origin: 'https://cdn.krxd.net',
				cache: getCacheOptions(1, true)
			});
		});

		it('GET https://ads-api.ft.com/v1/concept/{CONCEPT_ID}', () => {
			const conceptsRegex = new RegExp(`\/v1\/concept\/(${adsCaches.popularConcepts.join('|')})`);
			expect(routerStub.get).to.have.been.calledWith(conceptsRegex, handlerStub, {
				origin: 'https://ads-api.ft.com',
				cache: getCacheOptions(1)
			});
		});

		it('GET https://www.googletagservices.com/tag/js/gpt.js', () => {
			expect(routerStub.get).to.have.been.calledWith('/tag/js/gpt.js', handlerStub, {
				origin: 'https://www.googletagservices.com',
				cache: getCacheOptions(7)
			});
		});

		it('GET https://securepubads.g.doubleclick.net/gpt/pubads_impl_*.js', () => {
			expect(routerStub.get).to.have.been.calledWith('/gpt/pubads_impl_*.js', handlerStub, {
				origin: 'https://securepubads.g.doubleclick.net',
				cache: getCacheOptions(7)
			});
		});

		it('GET https://pagead2.googlesyndication.com/pagead/osd.js', () => {
			expect(routerStub.get).to.have.been.calledWith('/pagead/osd.js', handlerStub, {
				origin: 'https://pagead2.googlesyndication.com',
				cache: getCacheOptions(1)
			});
		});

		it('GET https://tpc.googlesyndication.com/safeframe/*/html/container.html', () => {
			expect(routerStub.get).to.have.been.calledWith('/safeframe/*/html/container.html', handlerStub, {
				origin: 'https://tpc.googlesyndication.com',
				cache: getCacheOptions(0)
			});
		});

		it('GET https://cdn.krxd.net/controltag*', () => {
			expect(routerStub.get).to.have.been.calledWith('/controltag*', handlerStub, {
				origin: 'https://cdn.krxd.net',
				cache: getCacheOptions(7)
			});
		});

		it('GET https://cdn.krxd.net/ctjs/controltag.js*', () => {
			expect(routerStub.get).to.have.been.calledWith('/ctjs/controltag.js*', handlerStub, {
				origin: 'https://cdn.krxd.net',
				cache: getCacheOptions(7)
			});
		});
	});
});
