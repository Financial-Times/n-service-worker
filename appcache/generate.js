const fs = require('fs');
const precache = require('../config/precache').appcache;
const urls = Object.keys(precache)
	.reduce((arr, key) => {
		return arr.concat(precache[key])
	}, [])

const manifest =`\
CACHE MANIFEST
# v1

CACHE:
${urls.join('\n')}

FALLBACK:

NETWORK:
*
`

fs.writeFileSync('dist/__appcache.manifest', manifest)
