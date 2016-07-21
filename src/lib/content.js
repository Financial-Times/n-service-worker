import toolbox from 'sw-toolbox';

const cacheOptions = {
	origin: 'https://*.ft.com',
	cache: {
		name: 'next:content',
		// our code base moves so fast, pointless caching enything longer than a few days
		maxAgeSeconds: 60
	}
};

toolbox.router.get('/', toolbox.fastest, cacheOptions);

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'cacheContent') {
		(msg.content || []).forEach(url => {
			toolbox.cache(url, cacheOptions);
		});
	}
});
