import router from '../utils/router';
import precache from '../utils/precache';
import { sw as precacheConfig} from '../../config/precache';

const options = {
	origin: self.registration.scope.replace(/\/$/, ''),
	cache: {
		name: 'image-v1'
	}
};

export default function init (cacheHandler) {
	precache(
		options.cache.name,
		precacheConfig[options.cache.name].map(image => new Request(image)),
		{ maxAge: -1 },
		{ isOptional: true }
	);

	//TODO - something for content images
	router.get('/__origami/service/image/v2/images/raw/fticon*', cacheHandler, options);
	router.get('/__origami/service/image/v2/images/raw/ftlogo*', cacheHandler, options);
	router.get('/__origami/service/image/v2/images/raw/ftsocial*', cacheHandler, options);
	router.get('/__assets/creatives*', cacheHandler, options);
}
