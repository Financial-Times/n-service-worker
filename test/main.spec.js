/*global expect, sinon */
import * as client from '../main';

// require rather than import because it has to be required
// in src to avoid circular dep (for now). If is imported here
// but required in src then sinon fails to stub the methods
const utils = require('../src/utils/sampleUsers');

describe('client', () => {
	describe('register', () => {
		beforeEach(() => {
			sinon.stub(navigator.serviceWorker, 'register').callsFake(() => Promise.reject());
		});

		afterEach(() => {
			navigator.serviceWorker.register.restore();
		});

		it('uses prod sw by default', () => {
			client.register({
				get: val => {
					if (val === 'serviceWorker') {
						return true;
					}
				}
			});
			expect(navigator.serviceWorker.register.calledWith('/__sw-prod.js')).to.be.true;
		});

		it('use variant in swQAVariant if set', () => {
			client.register({
				get: val => {
					if (val === 'swQAVariant') {
						return 'apples';
					} else if (val === 'serviceWorker') {
						return true;
					}
				}
			});
			expect(navigator.serviceWorker.register.calledWith('/__sw-apples.js')).to.be.true;
		});

		it('use canary release swCanaryRelease if set', () => {
			sinon.stub(utils, 'sampleUsers').callsFake(() => true);
			client.register({
				get: val => {
					if (val === 'swCanaryRelease') {
						return true;
					} else if (val === 'serviceWorker') {
						return true;
					}
				}
			});
			expect(navigator.serviceWorker.register.calledWith('/__sw-canary.js')).to.be.true;
			expect(utils.sampleUsers.calledWith(3, 'sw-canary')).to.be.true;
			utils.sampleUsers.restore();
		});

	});
});
