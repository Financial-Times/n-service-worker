import toolbox from 'sw-toolbox';

const cacheOptions = {
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

toolbox.precache(
	headerImages.map(image => `https://next-geebee.ft.com/image/v1/images/raw/${image}`)
);

toolbox.router.get('/image/v1/images/raw/fticon*', toolbox.cacheFirst, cacheOptions);
toolbox.router.get('/image/v1/images/raw/ftlogo*', toolbox.cacheFirst, cacheOptions);
toolbox.router.get('/image/v1/images/raw/ftsocial*', toolbox.cacheFirst, cacheOptions);
toolbox.router.get('/assets/*', toolbox.cacheFirst, cacheOptions);
