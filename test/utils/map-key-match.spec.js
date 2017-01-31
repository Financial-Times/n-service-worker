/* global expect */

import keyMatch from '../../src/utils/map-key-match';

describe('keyMatch', () => {
	it('should extract the value when given a map and a key', () => {
		const map = new Map();
		map.set('key1', 'value1')
		map.set('key12', 'value12')
		map.set('key123', 'value123')
		map.set('thisisacompletelydifferentkey', 'value123456')

		const result = keyMatch(map, 'key123')
		const expected = ['value1', 'value12', 'value123']

		expect(result).to.eql(expected)
	});

	it('should an array of all the keys that are `matched` in the target string', () => {
		const map = new Map();
		map.set('key1', 'value1')
		map.set('key2', 'value2')

		const result = keyMatch(map, 'key3')
		const expected = []

		expect(result).to.eql(expected)
	});

	it('should return an empty array if key doesn\'t exist in the map', () => {
		const map = new Map();
		map.set('key1', 'value1')
		map.set('key2', 'value2')

		const result = keyMatch(map, 'key3')
		const expected = []

		expect(result).to.eql(expected)
	});
});

['key1', 'value1'],
['key12', 'value12'],
['key123', 'value123'],
['key1234', 'value1234'],
['key12345', 'value12345']
