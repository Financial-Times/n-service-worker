/* global expect */

import offlineContent from '../../src/utils/offline-content';

describe('offlineContent', () => {

	context('should return a Request object', () => {
		it('with the correct url prepending `/offline` to `/content` paths', () => {
			const url = 'https://www.ft.com/content/2c509c50-e4ba-11e6-9645-c9357a75844a';
			const request = offlineContent(url);

			const result = request.url;
			const expected = 'https://www.ft.com/offline/content/2c509c50-e4ba-11e6-9645-c9357a75844a';

			expect(result).to.equal(expected);
		});

		it('with the correct url, not prepending `/offline` to non `/content` paths', () => {
			const url = 'https://www.ft.com/companies/automobiles';
			const request = offlineContent(url);

			const result = request.url;
			const expected = 'https://www.ft.com/companies/automobiles';

			expect(result).to.equal(expected);
		});

		it('with the correct credentials', () => {
			const url = 'https://www.ft.com/content/2c509c50-e4ba-11e6-9645-c9357a75844a';
			const request = offlineContent(url);

			const result = request.credentials;
			const expected = 'same-origin';

			expect(result).to.equal(expected);
		});

		it('with the correct number of headers ', () => {
			const url = 'https://www.ft.com/content/2c509c50-e4ba-11e6-9645-c9357a75844a';
			const request = offlineContent(url);

			const result = Array.from(request.headers.keys()).length;
			const expected = 1;

			expect(result).to.equal(expected);

		});

		it('with the correct headers', () => {
			const url = 'https://www.ft.com/content/2c509c50-e4ba-11e6-9645-c9357a75844a';
			const request = offlineContent(url);

			const result = request.headers.get('x-requested-with');
			const expected = 'ft-sw';

			expect(result).to.equal(expected);
		});
	});

});
