module.exports = {
	files: {
		allow: [
			'test/fixtures/files/0',
			'test/fixtures/files/1',
			'test/fixtures/files/2',
			'test/fixtures/files/3',
			'test/fixtures/files/4',
			'test/fixtures/files/5',
			'test/fixtures/files/6',
			'test/fixtures/files/7',
			'test/fixtures/files/8',
			'test/fixtures/files/9'
		],
		allowOverrides: []
	},
	strings: {
		deny: [],
		denyOverrides: [
			'd8009323-f898-3207-b543-eab4427b7a77', // src/caches/ads.js:15
			'852939c8-859c-361e-8514-f82f6c041580', // src/caches/ads.js:16
			'd969d76e-f8f4-34ae-bc38-95cfd0884740', // src/caches/ads.js:17
			'6da31a37-691f-4908-896f-2829ebe2309e', // src/caches/ads.js:18
			'f814d8f7-d38e-31b8-a51f-3882805288fd', // src/caches/ads.js:19
			'f967910f-67d5-31f7-a031-64f8af0d9cf1', // src/caches/ads.js:20
			'59fd6642-055c-30b0-b2b8-8120bc2990af', // src/caches/ads.js:21
			'40433e6c-d2ac-3994-b168-d33b89b284c7', // src/caches/ads.js:22
			'5c7592a8-1f0c-11e4-b0cb-b2227cce2b54' // src/caches/ads.js:23
		]
	}
};
