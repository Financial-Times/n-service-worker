import router from '../utils/router';
import precache from '../utils/precache';
import { sw as precacheConfig} from '../../config/precache';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'fonts-v1',
		maxEntries: 5
	}
};

export default function init (cacheHandler) {
	precache(
		options.cache.name,
		precacheConfig[options.cache.name],
		{ maxAge: -1 },
		{ isOptional: true }
	);

	// fonts route
	router.get('/__origami/service/build/v2/files/o-fonts-assets@:version/:font.woff', cacheHandler, options);
};
