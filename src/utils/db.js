import idb from 'idb';

export default class {

	constructor (storeName, { dbName = 'next', dbVersion = 1 } = { }) {
		this.storeName = storeName;
		this.idb = idb.open(dbName, dbVersion, upgradeDB => {
			upgradeDB.createObjectStore(storeName);
		})
			.then(db => {
				console.log(db)
				return db.createObjectStore(storeName)
					.catch(err => {
						if (!(err instanceof ConstraintError)) {
							console.log(err);
							throw err;
						}
					})
			});
	}

	get (key) {
		return this.idb.then(db => {
			return db.transaction(this.storeName)
				.objectStore(this.storeName)
				.get(key)
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
