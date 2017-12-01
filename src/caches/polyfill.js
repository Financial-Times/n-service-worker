import router from '../utils/router';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'polyfill-v1',
		maxEntries: 4
	}
};

export default function init (cacheHandler) {
	router.get('/__origami/service/polyfill/*', cacheHandler, options);
}
