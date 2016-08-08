
// note because flags don't exist on first page view
// if flag === false can clear cache
// if flag === undefined can put in cache but not retrieve
// if flag === true can put and retrieve from cache
let flags = {}; //eslint-disable-line
let dbPromise;

function openDb () {
	return new Promise(function (resolve, reject) {
		const request = indexedDB.open('next-flags', 1);

		request.onupgradeneeded = function () {
			request.result.createObjectStore('flags');
		};

		request.onsuccess = function () {
			resolve(request.result);
		};

		request.onerror = function () {
			reject(request.error);
		};
	});
}

function getStore () {
	if (!dbPromise) {
		dbPromise = openDb();
	}
	return dbPromise
		.then(db => {
			const transaction = db.transaction('flags', 'readwrite');
			return transaction.objectStore('flags');
		})
}

function setFlags (flags) {
	getStore()
		.then(store => {
			const request = store.put(flags, 'flags');
			request.onsuccess = () => {
				flags = flags;
			}
		})
}

function updateFlags () {
	getStore()
		.then(store => {
			const request = store.get('flags');
			request.onsuccess = () => {
				flags = request.result;
			};
		})
}


self.addEventListener('message', ev => {
	const msg = ev.data;
	if (msg.type === 'flagsUpdate') {
		setFlags(msg.flags);
	}
});

updateFlags();
setInterval(updateFlags, 1000 * 60 * 5)

export function getFlag (name) {
	return flags[name]
}
