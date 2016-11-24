import router from '../utils/router';;

import { getHandler } from '../utils/handlers';
import precache from '../utils/precache';

const options = {
	origin: 'https://www.ft.com',
	cache: {
		name: 'image'
	}
};

const headerImages = [
	'fticon-v1:hamburger?source=o-icons&tint=%23505050,%23505050&format=svg',
	'ftlogo:brand-ft-masthead?source=o-header&tint=%23505050,%23505050&format=svg',
	'ftlogo:brand-myft?source=o-header&tint=%23505050,%23505050&format=svg',
	'fticon-v1:search?source=o-icons&tint=%23505050,%23505050&format=svg'
]

precache(
	options.cache.name,
	headerImages.map(image => new Request(`https://www.ft.com/__origami/service/image/v2/images/raw/${image}`, {
		mode: 'cors'
	})),
	{ maxAge: -1 }
);

const cacheFirst = getHandler({strategy: 'cacheFirst', upgradeToCors: true})

//TODO - somethong for content images
router.get('/__origami/service/image/v2/images/raw/fticon*', cacheFirst, options);
router.get('/__origami/service/image/v2/images/raw/ftlogo*', cacheFirst, options);
router.get('/image/v2/images/raw/ftsocial*', cacheFirst, options);
router.get('/assets/*', cacheFirst, options);
