import toolbox from 'sw-toolbox';

import { cacheFirstFlagged } from '../utils/handlers';
import { registerCache } from '../utils/personal';

const options = {
	origin: 'https://session-next.ft.com',
	cache: {
		name: 'session',
		maxAge: 60 * 60
	}
};

registerCache('next:session');

toolbox.router.get('/(uuid)?', cacheFirstFlagged('swSessionCaching'), options);
