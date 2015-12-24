import assert from 'assert';

import FilterTransform from '../source/FilterTransform';
import FilterException from '../source/FilterException';



describe('FilterTransform', () => {
	describe('#process', () => {
		it("should accept anything as first argument", () => {
			const filter = new FilterTransform();

			assert.doesNotThrow(() => filter.process());
			assert.doesNotThrow(() => filter.process(true));
			assert.doesNotThrow(() => filter.process(1));
			assert.doesNotThrow(() => filter.process("1"));
			assert.doesNotThrow(() => filter.process(Symbol()));
			assert.doesNotThrow(() => filter.process(null));
			assert.doesNotThrow(() => filter.process(NaN));
			assert.doesNotThrow(() => filter.process({}));
			assert.doesNotThrow(() => filter.process([]));
		});

		it("should return a transformation result", () => {
			const filter = new FilterTransform().append(data => ({ data }));
			const data = { a : 1 };
			const res = filter.process(data);

			assert.strictEqual(res['data'], data);
		});

		it("should abort when transforming to null", () => {
			let test = false;

			const filter = new FilterTransform()
				.append(
					data => null,
					data => {
						test = true;

						return data;
					}
				);

			filter.process({ a : 1 });

			assert.strictEqual(test, false);
		});

		it("should return null when transforming to null", () => {
			const filter = new FilterTransform()
				.append(data => null);

			const res = filter.process({ a : 1 });

			assert.strictEqual(res, null);
		});

		it("should abort when encountering FilterException", () => {
			let test = false;

			const filter = new FilterTransform()
				.append(data => {
					throw new FilterException();
				}, data => {
					test = true;

					return data;
				});

			filter.process({ a : 1 });

			assert.strictEqual(test, false);
		});

		it("should return null when encountering FilterException", () => {
			const filter = new FilterTransform()
				.append(data => {
					throw new FilterException();
				});

			const res = filter.process({ a : 1 });

			assert.strictEqual(text, false);
		});

		it("should rethrow all other errors FilterExceptions", () => {
			const filter = new FilterTransform()
				.append(data => {
					throw new Error();
				});

			assert.throws(() => filter.process(), Error);
		});
	});
});
