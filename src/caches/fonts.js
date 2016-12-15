import router from '../utils/router';;

import { getHandler } from '../utils/handlers';
import precache from '../utils/precache';
import { sw as precacheConfig} from '../../config/precache';

const options = {
	origin: 'https://www.ft.com',
	cache: {
		name: 'fonts',
		maxEntries: 5
	}
};

precache(options.cache.name, precacheConfig.fonts, { maxAge: -1 });

// fonts route
router.get('/__origami/service/build/v2/files/o-fonts-assets@:version/:font.woff', getHandler({strategy: 'cacheFirst'}), options);
