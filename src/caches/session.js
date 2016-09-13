import router from '../utils/router';;

import { getHandler } from '../utils/handlers';
import { registerCache } from '../utils/personal';

const options = {
	origin: 'https://session-next.ft.com',
	cache: {
		name: 'session',
		maxAge: 60 * 60
	}
};

registerCache('next:session');

router.get('/(uuid)?', getHandler({strategy: 'cacheFirst', flag: 'swSessionCaching'}), options);
