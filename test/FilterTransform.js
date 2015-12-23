import assert from 'assert';

import FilterTransform from '../source/FilterTransform';
import FilterException from '../source/FilterException';



describe('FilterTransform', () => {
	describe('#process', () => {
		it("should accept an object argument");
		it("should accept only an object argument");
		it("should return a transformation result");
		it("should abort when transforming to null");
		it("should return null when transforming to null");
		it("should abort when encountering FilterException");
		it("should return null when encountering FilterException");
		it("should rethrow all errors except FilterExceptions");
	});
});
