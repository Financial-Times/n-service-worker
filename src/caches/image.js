import router from '../utils/router';;

import { getHandler } from '../utils/handlers';
import precache from '../utils/precache';
import { sw as precacheConfig} from '../../config/precache';

const options = {
	origin: 'https://www.ft.com',
	cache: {
		name: 'image'
	}
};

precache(
	options.cache.name,
	precacheConfig.image.map(image => new Request(image, { mode: 'cors'	})),
	{ maxAge: -1 }
);

const cacheFirst = getHandler({strategy: 'cacheFirst', upgradeToCors: true})

//TODO - something for content images
router.get('/__origami/service/image/v2/images/raw/fticon*', cacheFirst, options);
router.get('/__origami/service/image/v2/images/raw/ftlogo*', cacheFirst, options);
router.get('/__origami/service/image/v2/images/raw/ftsocial*', cacheFirst, options);
router.get('/__assets/creatives*', cacheFirst, options);
