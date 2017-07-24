/* global expect */

import parseLinkHeaders from '../../src/utils/parse-link-headers';

describe('parseLinkHeaders', () => {
	it('should corrctly parse document link headers', () => {
		const header = '</content/bbb49a30-e583-11e6-967b-c88452263daf>; as="document"; rel="precache"; nopush';

		const expected = [{ 'as': 'document', 'rel': 'precache', 'url': '/content/bbb49a30-e583-11e6-967b-c88452263daf' }];
		const result = parseLinkHeaders(header);

		expect(result).to.eql(expected);
	});

	it('should corrctly parse image link headers', () => {
		const header = '<https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fd4f61270-e543-11e6-967b-c88452263daf?source=next&fit=scale-down&compression=best&width=500>; as="image"; rel="precache"; nopush';

		const expected = [{ 'source': 'next', 'fit': 'scale-down', 'compression': 'best', 'width': '500', 'as': 'image', 'rel': 'precache', 'url': 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fd4f61270-e543-11e6-967b-c88452263daf?source=next&fit=scale-down&compression=best&width=500' }];
		const result = parseLinkHeaders(header);

		expect(result).to.eql(expected);
	});

	it('should parse multiple link headers', () => {
		const headers = '</offline/main.css>; as="style"; rel="preload"; nopush, <//www.ft.com/__assets/n-ui/cached/v3/es5.min.js>; as="script"; rel="preload"; nopush, </offline/main-without-n-ui.js>; as="script"; rel="preload"; nopush';

		const expected =
		[
			{ 'as': 'style', 'rel': 'preload', 'url': '/offline/main.css' },
			{ 'as': 'script', 'rel': 'preload', 'url': '//www.ft.com/__assets/n-ui/cached/v3/es5.min.js' },
			{ 'as': 'script', 'rel': 'preload', 'url': '/offline/main-without-n-ui.js' }
		];
		const result = parseLinkHeaders(headers);

		expect(result).to.eql(expected);
	});

	it('should parse multiple link headers with commas in the header', () => {
		const headers = '<//next-geebee.ft.com/polyfill/v2/polyfill.min.js?features=default,requestAnimationFrame,Promise,matchMedia,HTMLPictureElement,fetch,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes|always|gated,IntersectionObserver,Map,Array.from&flags=gated&unknown=polyfill&callback=ftNextPolyfillServiceCallback&next-variant=enhanced>; as="script"; rel="preload"; nopush, </offline/main.css>; as="style"; rel="precache"; nopush';

		const expected =
		[
			{
				'features': 'default,requestAnimationFrame,Promise,matchMedia,HTMLPictureElement,fetch,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes|always|gated,IntersectionObserver,Map,Array.from',
				'flags': 'gated',
				'unknown': 'polyfill',
				'callback': 'ftNextPolyfillServiceCallback',
				'next-variant': 'enhanced',
				'as': 'script',
				'rel': 'preload',
				'url': '//next-geebee.ft.com/polyfill/v2/polyfill.min.js?features=default,requestAnimationFrame,Promise,matchMedia,HTMLPictureElement,fetch,Array.prototype.find,Array.prototype.findIndex,Array.prototype.includes|always|gated,IntersectionObserver,Map,Array.from&flags=gated&unknown=polyfill&callback=ftNextPolyfillServiceCallback&next-variant=enhanced'
			}, {
				'as': 'style',
				'rel': 'precache',
				'url': '/offline/main.css'
			},
		];
		const result = parseLinkHeaders(headers);

		expect(result).to.eql(expected);
	});
});
