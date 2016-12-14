const fs = require('fs');
const precache = require('../config/precache').appcache;
const urls = Object.keys(precache)
	.reduce((arr, key) => {
		return arr.concat(precache[key])
	}, []);

const landing = process.argv[2] === 'landing';

if(landing) {
	urls.push('/__offline/landing');
}

const manifest =`\
CACHE MANIFEST
# v1

CACHE:
${urls.join('\n')}

FALLBACK:
${landing ? '/ /__offline/landing' : ''}

NETWORK:
*
`

if(landing) {
	fs.writeFileSync('dist/__appcache-landing.manifest', manifest);
} else {
	fs.writeFileSync('dist/__appcache.manifest', manifest);
}
