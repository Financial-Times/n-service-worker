import toolbox from 'sw-toolbox';

import { cacheFirstFlagged } from '../utils/handlers';
import { registerCache } from '../utils/personal';
import precache from '../utils/precache';

function getCacheOptions (days, isPersonal) {
	return {
		name: 'ads' + (isPersonal ? ':personal' : ''),
		maxAge: 60 * 60 * ( days >= 1 ? days * 24 : 1 ),
		maxEntries: 60
	}
}

registerCache('next:ads:personal');

const popularStreams = [
	'MQ==-U2VjdGlvbnM=',
	'MTA3-U2VjdGlvbnM=',
	'Ng==-U2VjdGlvbnM=',
	'Mg==-U2VjdGlvbnM=',
	'TnN0ZWluX0dMX0NO-R0w=',
	'MjI=-U2VjdGlvbnM=',
	'MTE=-U2VjdGlvbnM=',
	'MTA2-U2VjdGlvbnM=',
	'OQ==-U2VjdGlvbnM=',
	'MjM=-U2VjdGlvbnM=',
	'MTY=-U2VjdGlvbnM=',
	'Mjk=-U2VjdGlvbnM=',
	'MzA=-U2VjdGlvbnM=',
	'NTc=-U2VjdGlvbnM=',
	'NTA=-U2VjdGlvbnM=',
	'MzQ=-U2VjdGlvbnM=',
	'NTU=-U2VjdGlvbnM=',
	'NDU=-U2VjdGlvbnM=',
	'NTM=-U2VjdGlvbnM=',
	'NTY=-U2VjdGlvbnM=',
	'NDE=-U2VjdGlvbnM=',
	'NzE=-U2VjdGlvbnM=',
	'MTA0-U2VjdGlvbnM=',
	'MTA1-U2VjdGlvbnM=',
	'MTAz-U2VjdGlvbnM=',
	'OTg=-U2VjdGlvbnM=',
	'NzI=-U2VjdGlvbnM=',
	'OTM=-U2VjdGlvbnM=',
	'MTE2-U2VjdGlvbnM=',
	'MTE3-U2VjdGlvbnM=',
	'MDRkMzU4YjktMjA0OS00MWEzLWJiY2ItYmJkZWNhMmVmMzQ0-QnJhbmRz',
	'MTE4-U2VjdGlvbnM=',
	'YzhlNzZkYTctMDJiNy00NTViLTk3NmYtNmJjYTE5NDEyM2Yw-QnJhbmRz',
	'MTIz-U2VjdGlvbnM=',
	'MNQ==-R2VucmVz',
	'MTI1-U2VjdGlvbnM=',
	'MTI3-U2VjdGlvbnM=',
	'MTI2-U2VjdGlvbnM=',
	'MTM1-U2VjdGlvbnM=',
	'ZjU2ZGIyNDMtNWYwOS00YzcwLWJmN2MtYjE1OGNiN2Y1OTVl-U2VjdGlvbnM=',
	'MTM4-U2VjdGlvbnM=',
	'MTQ4-U2VjdGlvbnM=',
	'MTU3-U2VjdGlvbnM=',
	'MTU5-U2VjdGlvbnM=',
	'MTU2-U2VjdGlvbnM=',
	'MTY1-U2VjdGlvbnM=',
	'MTU4-U2VjdGlvbnM=',
	'MTQ5-U2VjdGlvbnM=',
	'MWJkMTFlYmUtNmRjMy00MDE5LWI0MGItYjM1MjRkOGFmODhk-U2VjdGlvbnM=',
	'MTUz-U2VjdGlvbnM=',
	'MTUy-U2VjdGlvbnM=',
	'OTYxNmI3YWMtY2M1OS00N2RkLWJlNWEtOGZjOGQ3ODE5YmQx-U2VjdGlvbnM=',
	'MTQw-U2VjdGlvbnM=',
	'MTQy-U2VjdGlvbnM=',
	'MTQz-U2VjdGlvbnM=',
	'MTQ0-U2VjdGlvbnM=',
	'MTQ1-U2VjdGlvbnM=',
	'MTQ2-U2VjdGlvbnM=',
	'NTQ=-U2VjdGlvbnM=',
	'NTlhNzEyMzMtZjBjZi00Y2U1LTg0ODUtZWVjNmEyYmU1NzQ2-QnJhbmRz'
];

const sections = [
	'MQ==-U2VjdGlvbnM=',
	'Mjk=-U2VjdGlvbnM=',
	'NzE=-U2VjdGlvbnM=',
	'MTE2-U2VjdGlvbnM=',
	'MTI1-U2VjdGlvbnM=',
	'MTQ4-U2VjdGlvbnM=',
	'MTQw-U2VjdGlvbnM=',
	'NTQ=-U2VjdGlvbnM=',
	'NTlhNzEyMzMtZjBjZi00Y2U1LTg0ODUtZWVjNmEyYmU1NzQ2-QnJhbmRz' // fastft
];

const precacheCacheOptions = getCacheOptions(7);
precache(
	precacheCacheOptions.name,
	sections.map(section => `https://ads-api.ft.com/v1/concept/${section}`),
	{ maxAge: precacheCacheOptions.maxAge, maxEntries: precacheCacheOptions.maxEntries }
);

toolbox.router.get(new RegExp('\/v1\/concept\/(' + popularStreams.join('|') + ')'), cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://ads-api.ft.com',
	cache: getCacheOptions(7)
});

toolbox.router.get('/v1/user', cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://ads-api.ft.com',
	cache: getCacheOptions(7, true)
});

toolbox.router.get('/tag/js/gpt.js', cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://www.googletagservices.com',
	cache: getCacheOptions(7)
});

toolbox.router.get('/gpt/pubads_impl_*.js', cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://partner.googleadservices.com',
	cache: getCacheOptions(30)
});

toolbox.router.get('/pagead/osd.js', cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://pagead2.googlesyndication.com',
	cache: getCacheOptions(1)
});

toolbox.router.get('/safeframe/1-0-4/html/container.html', cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://tpc.googlesyndication.com',
	cache: getCacheOptions(0)
});

toolbox.router.get('/userdata/*', cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://cdn.krxd.net',
	cache: getCacheOptions(1, true)
});

toolbox.router.get('/controltag', cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://cdn.krxd.net',
	cache: getCacheOptions(7)
});

toolbox.router.get('/ctjs/controltag.js*', cacheFirstFlagged('swAdsCaching'), {
	origin: 'https://cdn.krxd.net',
	cache: getCacheOptions(30)
});
