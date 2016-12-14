/**
 * All "incoming" events should have a "source" val in their data.
 * These mappings provide a simple "link" to the associated idb.
 */

export const mappings = {
	'offline-app': {
		dbName: 'next:offline-ft-v1',
		storeName: 'requests'
	}
}

export default function idbForSource (source) {
	return mappings[source] ? mappings[source] : null;
}
