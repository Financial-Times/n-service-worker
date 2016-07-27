import toolbox from 'sw-toolbox';
import {cacheFirst} from '../utils/flagged-toolbox';
import {registerCache} from '../utils/personal';

const cacheOptions = {
	origin: 'https://session-next.ft.com',
	cache: {
		name: 'next:session',
		maxAgeSeconds: 60 * 60
	}
};

registerCache('next:session');

toolbox.router.get('/', cacheFirst('swSessionCaching'), cacheOptions);
toolbox.router.get('/uuid', cacheFirst('swSessionCaching'), cacheOptions);
