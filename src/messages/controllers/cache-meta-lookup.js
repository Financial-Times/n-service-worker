/**
 * Lookup and return the cache meta object for a provided key (aka. url) in
 * relevant store. If no url provided, return all keys found in relevant store.
 *
 * Relevant store is decided by the incoming events signed `source`
 */

import Db from '../../utils/db';
import idbForSource from '../../../config/idb-client-map';

export default function (data, source, event, res) {
	const { url } = data;
	const { dbName, storeName } = idbForSource(source);

	if (!dbName || !storeName) return { error: `No idb found for: ${source}` };

	const requestKeyValStore = new Db(storeName, { dbName });

	if (url) {

		// return specific url object if found
		requestKeyValStore.get(url)
			.then(fileMeta => {
				// not found error
				if (!fileMeta) return { error: `${url} not found in ${dbName}:${storeName} idb` };

				// append info about the idb store
				fileMeta.storeName = storeName;
				fileMeta.dbName = dbName;

				return fileMeta;
			})
			.then(result => res(result));

	} else {

		// return all keys
		requestKeyValStore.getAllKeys()
			.then(cacheKeys => {
				// not found error
				if (!cacheKeys) return { error: `No keys found in ${dbName}:${storeName} idb` };

				// append info about the idb store
				return { storeName, dbName, keys: cacheKeys };
			})
			.then(result => res(result));

	}

}
