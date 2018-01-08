import router from '../utils/router';
import { registerCache } from '../utils/personal';
import { purgeCache } from '../utils/purgeCache';

const options = {
	origin: self.host || 'https://www.ft.com',
	cache: {
		name: 'myft-v1',
		maxAge: 60 * 60 * 12
	}
};

export default function init (cacheHandler) {
	registerCache('next:myft-v1');

	router.get('/__myft/api/*', cacheHandler, options);
	router.put('/__myft/api/*', purgeCache);
	router.post('/__myft/api/*', purgeCache);
	router.delete('/__myft/api/*', purgeCache);
}
