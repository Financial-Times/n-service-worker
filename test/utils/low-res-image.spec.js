/* global expect */

import * as url from 'url'
import lowResImage from '../../src/utils/low-res-image'

describe('Low Res Image', () => {

	context('non-image service URLs', () => {
		it('should add image url to image service url if it wasn\'t one already', () => {
			const imageURL = 'http://com.ft.imagepublish.prod.s3.amazonaws.com/d4f61270-e543-11e6-967b-c88452263daf'

			const result = lowResImage(imageURL);
			const expected = '/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fd4f61270-e543-11e6-967b-c88452263daf?quality=medium&width=150&source=offline-ft-sw';

			expect(result).to.eq(expected)
		});
	});

	context('image service URLs', () => {
		it('should not re-encode an image service url', () => {
			const imageURL = '/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fd4f61270-e543-11e6-967b-c88452263daf'

			const result = lowResImage(imageURL);
			const expected = '/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fd4f61270-e543-11e6-967b-c88452263daf?quality=medium&width=150&source=offline-ft-sw';

			expect(result).to.equal(expected)
		});

		it('should add a querystring if none exists to use quality, width and source defaults', () => {
			const imageURL = '/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fd4f61270-e543-11e6-967b-c88452263daf'

			const transformedURL = lowResImage(imageURL);
			const result = url.parse(transformedURL, true).query;
			const expected = { quality: 'medium' , width: '150' , source: 'offline-ft-sw' }

			expect(result).to.eql(expected)
		});

		it('should change an existing querystring to use quality, width and source defaults', () => {
			const imageURL = '/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fd4f61270-e543-11e6-967b-c88452263daf?source=next&width=700'

			const transformedURL = lowResImage(imageURL);
			const result = url.parse(transformedURL, true).query;
			const expected = { quality: 'medium' , width: '150' , source: 'offline-ft-sw' }

			expect(result).to.eql(expected)
		});

		it('should only add or change quality, width and source querystring params, not remove others', () => {
			const imageURL = '/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fd4f61270-e543-11e6-967b-c88452263daf?source=next&fit=scale-down&width=700'

			const transformedURL = lowResImage(imageURL);
			const result = url.parse(transformedURL, true).query;
			const expected = { quality: 'medium' , width: '150' , source: 'offline-ft-sw' , fit: 'scale-down' }

			expect(result).to.eql(expected)
		});

	});
});
