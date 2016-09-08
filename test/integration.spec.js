import { passFlags } from '../main'


describe('integration', () => {
	before(() => SWTestHelper.resetEnv());
	before(() => SWTestHelper.installSW('/integration-sw.js'))
	afterEach(() => passFlags({}));
	after(() => SWTestHelper.resetEnv());
	require('./caches/ads.spec')
	require('./caches/fonts.spec')
})
