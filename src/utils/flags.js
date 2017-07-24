import idb from 'idb';

// note because flags don't exist on first page view
// if flag === false can clear cache
// if flag === undefined can put in cache but not retrieve
// if flag === true can put and retrieve from cache
let flags = {}; //eslint-disable-line
let dbPromise;

function openDb () {
	return idb.open('next-flags', 1, updateDb => {
		updateDb.createObjectStore('flags');
	});
}

function getDb () {
	if (!dbPromise) {
		dbPromise = openDb();
	}
	return dbPromise;
}

function setFlags (newFlags) {
	return getDb()
		.then(db => {
			const tx = db.transaction('flags', 'readwrite');
			tx.objectStore('flags').put(newFlags, 'flags');
			return tx.complete;
		})
		.then(() => {
			flags = newFlags;
		});
}

function updateFlags () {
	return getDb()
		.then(db => {
			const tx = db.transaction('flags');
			tx.objectStore('flags').get('flags');
			return tx.complete;
		})
		.then(newFlags => {flags = newFlags || flags;});
}

updateFlags();
setInterval(updateFlags, 1000 * 60 * 5);

self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'flagsUpdate') {
		return setFlags(msg.flags)
			.then(() => ev.ports[0].postMessage('success'));
	}
});

function getFlag (name) {
	return flags[name];
}

export {getFlag, setFlags};
