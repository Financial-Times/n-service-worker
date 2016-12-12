import router from '../utils/router';;

import { getHandler } from '../utils/handlers';
import precache from '../utils/precache';
import { image as precacheImages} from '../../config/precache';

const options = {
	origin: 'https://www.ft.com',
	cache: {
		name: 'image'
	}
};

precache(
	options.cache.name,
	precacheImages.map(image => new Request(image, { mode: 'cors'	})),
	{ maxAge: -1 }
);

const cacheFirst = getHandler({strategy: 'cacheFirst', upgradeToCors: true})

//TODO - somethong for content images
router.get('/__origami/service/image/v2/images/raw/fticon*', cacheFirst, options);
router.get('/__origami/service/image/v2/images/raw/ftlogo*', cacheFirst, options);
router.get('/image/v2/images/raw/ftsocial*', cacheFirst, options);
router.get('/assets/*', cacheFirst, options);
