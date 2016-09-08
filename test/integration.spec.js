import { passFlags } from '../main'

describe('integration', () => {
	before(() => SWTestHelper.resetEnv());
	before(() => SWTestHelper.installSW('/integration-sw.js')
		.then(() => (window.installedAt = Date.now()))
	)
	afterEach(() => passFlags({}));
	after(() => SWTestHelper.resetEnv());
	require('./caches/ads.spec')
	require('./caches/fonts.spec')
})
