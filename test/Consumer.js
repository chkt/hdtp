import assert from 'assert';

import FilterTransform from '../source/FilterTransform';
import Consumer from '../source/Consumer';



describe('Consumer', () => {
	describe('#constructor', () => {
		it("should accept a function as first argument", () => {
			assert.throws(() => new Consumer(), TypeError);
			assert.throws(() => new Consumer(true), TypeError);
			assert.throws(() => new Consumer(1), TypeError);
			assert.throws(() => new Consumer("1"), TypeError);
			assert.throws(() => new Consumer(Symbol()), TypeError);
			assert.throws(() => new Consumer({}), TypeError);
			assert.throws(() => new Consumer([]), TypeError);
			assert.doesNotThrow(() => new Consumer(data => 1));
		});

		it("should return a new instance", () => {
			const consumer = new Consumer(data => 1);

			assert(consumer instanceof Consumer);
		});
	});


	describe('#requestTransform', () => {
		it("should be of type FilterTransform", () => {
			const consumer = new Consumer(data => 1);

			assert(consumer.requestTransform instanceof FilterTransform);
		});

		it("should be readonly", () => {
			const consumer = new Consumer(data => 1);

			assert.throws(() => consumer.requestTransform = true);
		});
	});

	describe('#replyTransform', () => {
		it("should be of type FilterTransform", () => {
			const consumer = new Consumer(data => 1);

			assert(consumer.replyTransform instanceof FilterTransform);
		});

		it("should be readonly", () => {
			const consumer = new Consumer(data => 1);

			assert.throws(() => consumer.replyTransform = true);
		});
	});


	describe('#target', () => {
		it("should be of type function", () => {
			const consumer = new Consumer(data => 1);

			assert.strictEqual(typeof consumer.target, 'function');
		});

		it("should initially reference the constructor argument", () => {
			const fn = data => 1;
			const consumer = new Consumer(fn);

			assert.strictEqual(consumer.target, fn);
		});

		it("should reference a function", () => {
			const consumer = new Consumer(data => 1);

			assert.doesNotThrow(() => consumer.target = () => 2);
		});

		it("should return the referenced function", () => {
			const fn = data => 2;
			const consumer = new Consumer(data => 1);

			consumer.target = fn;

			assert.strictEqual(consumer.target, fn);
		});
	});


	describe('#consume', () => {
		it("should accept any object as first argument", () => {
			const consumer = new Consumer(data => Promise.resolve(data));

			assert.throws(() => consumer.consume(true), TypeError);
			assert.throws(() => consumer.consume(1), TypeError);
			assert.throws(() => consumer.consume("1"), TypeError);
			assert.throws(() => consumer.consume(Symbol()), TypeError);
			assert.throws(() => consumer.consume(null));
			assert.doesNotThrow(() => consumer.consume({}));
			assert.doesNotThrow(() => consumer.consume([]));
			assert.doesNotThrow(() => consumer.consume(() => 1));
			assert.throws(() => consumer.consume(undefined));
			assert.throws(() => consumer.consume(NaN));
		});

		it("should return a promise", () => {
			const consumer = new Consumer(data => Promise.resolve(data));
			const ret = consumer.consume({});

			assert(ret instanceof Promise);
		});

		it("should require the target callback to return a promise", () => {
			assert.throws(() => new Consumer(data => 1).consume({}), ReferenceError);
			assert.throws(() => new Consumer(data => ({})).consume({}), ReferenceError);
			assert.doesNotThrow(() => new Consumer(data => Promise.resolve(data)));
		});

		it("should return a promise resolving to null if aborted inside request filter", done => {
			const consumer = new Consumer(data => Promise.resolve(data));

			consumer.requestTransform.append(data => null);
			consumer.consume({})
				.then(val => {
					if (val === null) done();
					else done(new Error());
				}, why => {
					done(new Error());
				});
		});

		it("should return a promise resolving to null if aborted inside reply filter", done => {
			const consumer = new Consumer(data => Promise.resolve(data));

			consumer.replyTransform.append(data => null);
			consumer.consume({})
				.then(val => {
					if (val === null) done();
					else done(new Error());
				}, why => {
					done(new Error());
				});
		});
	});


	describe('.Configure', () => {
		it("should accept a function as first argument");
		it("should optionally accept an array of functions as second argument");
		it("should optionally accept an array of function as tertiary argument");
		it("should return a configured instance");
	});
});
