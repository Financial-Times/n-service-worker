import toolbox from 'sw-toolbox';

import { cacheFirstFlagged } from '../utils/handlers';
import precache from '../utils/precache';

const options = {
	origin: 'https://next-geebee.ft.com',
	cache: {
		name: 'next:image'
	}
};

const headerImages = [
	'fticon:hamburger?source=o-icons&tint=%23505050,%23505050&format=svg',
	'ftlogo:brand-ft-masthead?source=o-header&tint=%23505050,%23505050&format=svg',
	'ftlogo:brand-myft?source=o-header&tint=%23505050,%23505050&format=svg'
]

precache(
	options.cache.name,
	headerImages.map(image => `https://next-geebee.ft.com/image/v1/images/raw/${image}`),
	{ maxAge: -1 }
);

toolbox.router.get('/image/v1/images/raw/fticon*', cacheFirstFlagged, options);
toolbox.router.get('/image/v1/images/raw/ftlogo*', cacheFirstFlagged, options);
toolbox.router.get('/image/v1/images/raw/ftsocial*', cacheFirstFlagged, options);
toolbox.router.get('/assets/*', cacheFirstFlagged, options);
