import assert from 'assert';

import Consumer from '../source/Consumer';



describe('Consumer', () => {
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

	describe('.Configure', () => {
		it("should accept a function as first argument", () => {
			assert.throws(() => Consumer.Configure(), TypeError);
			assert.throws(() => Consumer.Configure(true), TypeError);
			assert.throws(() => Consumer.Configure(1), TypeError);
			assert.throws(() => Consumer.Configure("1"), TypeError);
			assert.throws(() => Consumer.Configure(Symbol()), TypeError);
			assert.throws(() => Consumer.Configure({}), TypeError);
			assert.throws(() => Consumer.Configure([]), TypeError);
			assert.doesNotThrow(() => Consumer.Configure(data => 1));
		});

		it("should optionally accept an array of functions as second argument", () => {
			const fn = data => Promise.resolve(data);

			assert.throws(() => Consumer.Configure(fn, true), TypeError);
			assert.throws(() => Consumer.Configure(fn, 1), TypeError);
			assert.throws(() => Consumer.Configure(fn, "1"), TypeError);
			assert.throws(() => Consumer.Configure(fn, Symbol()), TypeError);
			assert.throws(() => Consumer.Configure(fn, {}), TypeError);
			assert.throws(() => Consumer.Configure(fn, fn), TypeError);

			assert.doesNotThrow(() => Consumer.Configure(fn, []));
			assert.throws(() => Consumer.Configure(fn, [ true ]), TypeError);
			assert.throws(() => Consumer.Configure(fn, [ 1 ]), TypeError);
			assert.throws(() => Consumer.Configure(fn, [ "1" ]), TypeError);
			assert.throws(() => Consumer.Configure(fn, [ Symbol() ]), TypeError);
			assert.throws(() => Consumer.Configure(fn, [ {} ]), TypeError);
			assert.doesNotThrow(() => Consumer.Configure(fn, [ fn ]));
		});

		it("should optionally accept an array of functions as tertiary argument", () => {
			const fn = data => Promise.resolve(data);

			assert.throws(() => Consumer.Configure(fn, [], true), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], 1), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], "1"), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], Symbol()), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], {}), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], fn), TypeError);

			assert.doesNotThrow(() => Consumer.Configure(fn, [], []));
			assert.throws(() => Consumer.Configure(fn, [], [ true ]), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], [ 1 ]), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], [ "1" ]), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], [ Symbol() ]), TypeError);
			assert.throws(() => Consumer.Configure(fn, [], [ {} ]), TypeError);
			assert.doesNotThrow(() => Consumer.Configure(fn, [], [ fn ]));
		});

		it("should return a configured instance", () => {
			const fnA = data => data;
			const fnB = data => data;
			const fnC = data => Promise.resolve(data);

			const consumer = Consumer.Configure(fnC, [ fnA ], [ fnB ]);

			assert.strictEqual(fnC, consumer.target);
			assert.strictEqual(consumer.requestTransform.items.length, 1);
			assert.strictEqual(consumer.requestTransform.items[0], fnA);
			assert.strictEqual(consumer.replyTransform.items.length, 1);
			assert.strictEqual(consumer.replyTransform.items[0], fnB);
		});
	});
});
