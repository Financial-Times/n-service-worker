/* global SWTestHelper */
import { passFlags } from '../main'

before(() => SWTestHelper.resetEnv());
before(() => SWTestHelper.installSW('/integration-sw.js')
	.then(() => (SWTestHelper.installedAt = Date.now()))
	// .then(() => console.log('sw installed'))
)
afterEach(() => passFlags({}));
after(() => SWTestHelper.resetEnv());
