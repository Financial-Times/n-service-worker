import idb from 'indexeddb-promised';

console.log(idb);

export default class {

	constructor (storeName, { dbName = 'next', dbVersion = 1 } = { }) {
		this.storeName = storeName;
		this.dbPromise = idb.open(dbName, dbVersion, upgradeDB => {
			upgradeDB.createObjectStore(storeName);
		});
	}

	get (key) {
		return this.dbPromise.then(db => {
			return db.transaction(this.storeName)
        		.objectStore(this.storeName).get(key);
    		});
	}

	set (key, val) {
		return this.dbPromise.then(db => {
      		const tx = db.transaction(this.storeName, 'readwrite');
      		tx.objectStore(this.storeName).put(val, key);
      		return tx.complete;
    	});
	}

  	delete (key) {
    	return this.dbPromise.then(db => {
      		const tx = db.transaction(this.storeName, 'readwrite');
      		tx.objectStore(this.storeName).delete(key);
      		return tx.complete;
    	});
  	}

}
