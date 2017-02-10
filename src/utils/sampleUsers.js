const cookieStore = require('./cookies');

const getSpoorNumber = () => {
	let spoorId = cookieStore.get('spoor-id').replace(/-/g, '');
	spoorId = spoorId.substring(spoorId.length - 12, spoorId.length); // Don't overflow the int
	return parseInt(spoorId, 16);
}

const sampleUsers = (pct, seed) => {
	if (!seed) {
		throw new Error('sampleUsers needs a seed string to be passed in as the second parameter')
	}
	const seedAsNumber = seed.split('').reduce((num, str, i) => num + Math.pow(2, i) * str.charCodeAt(0), 0);
	return (getSpoorNumber() + seedAsNumber) % 100 < pct
}

module.exports = {sampleUsers};
