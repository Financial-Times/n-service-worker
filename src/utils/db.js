import IndexedDbPromised from 'indexeddb-promised';

export default class {

	constructor (storeName, { dbName = 'next', dbVersion = 1 } = { }) {
		this.storeName = storeName;
		const indexedDBPromised = new IndexedDbPromised(dbName);
		this.idb = indexedDBPromised
			.setVersion(dbVersion)
			.addObjectStore({ name: storeName })
			.build();
	}

	get (key) {
		return this.idb[this.storeName].get(key);
	}

	getAll () {
		return this.idb[this.storeName].getAll();
	}

	set (key, val) {
		return this.idb[this.storeName].put(val, key);
	}

	delete (key) {
		return this.idb[this.storeName].delete(key);
	}

}
