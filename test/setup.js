/* global SWTestHelper */
import { passFlags } from '../main'

before(() => SWTestHelper.resetEnv());
before(() => SWTestHelper.installSW('/integration-sw.js')
	.then(() => (SWTestHelper.installedAt = Date.now()))
)
afterEach(() => passFlags({}));
after(() => SWTestHelper.resetEnv());
