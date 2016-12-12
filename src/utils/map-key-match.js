
module.exports = function keyMatch (map, string) {
	// This would be better written as a for..of loop, but that would break the
	// minifyify process in the build.
	const entriesIterator = map.entries();
	let item = entriesIterator.next();
	const matches = [];
	while (!item.done) {
		const pattern = new RegExp(item.value[0]);
		if (pattern.test(string)) {
			matches.push(item.value[1]);
		}
		item = entriesIterator.next();
	}
	return matches;
};
