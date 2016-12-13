import idb from 'idb';

export default class {

	constructor (storeName, { dbName = 'next', dbVersion = 1 } = { }) {
		this.storeName = storeName;
		this.idb = idb.open(dbName, dbVersion, upgradeDB => {
			upgradeDB.createObjectStore(storeName);
		});
	}

	get (key) {
		return this.idb.then(db => {
			return db.transaction(this.storeName)
				.objectStore(this.storeName)
				.get(key)
		});
	}

	getAll () {
		return this.idb.then(db => {
			return db.transaction(this.storeName)
				.objectStore(this.storeName)
				.getAll()
		});
	}

	getAllKeys() {
		return this.idb.then(db => {
			return db.transaction(this.storeName)
				.objectStore(this.storeName)
				.getAllKeys()
		});
	}


	set (key, val) {
		return this.idb.then(db => {
			const tx = db.transaction(this.storeName, 'readwrite')
			tx.objectStore(this.storeName).put(val, key)
			return tx.complete
		});
	}

	delete (key) {
		return this.idb.then(db => {
			const tx = db.transaction(this.storeName, 'readwrite')
			tx.objectStore(this.storeName).delete(key)
			return tx.complete
		});
	}
}
