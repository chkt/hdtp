import assert from 'assert';

import Consumer from '../source/Consumer';
import Distributor from '../source/Distributor';



function promiseFn(data) {
	return Promise.resolve(data);
}



describe('Distributor', () => {

	describe('#constructor', () => {
		it("should not require any arguments", () => {
			assert.doesNotThrow(() => new Distributor());
		});

		it("should accept an array of consumers as first argument", () => {
			assert.throws(() => new Distributor(true), TypeError);
			assert.throws(() => new Distributor(1), TypeError);
			assert.throws(() => new Distributor("1"), TypeError);
			assert.throws(() => new Distributor(Symbol("1")), TypeError);
			assert.throws(() => new Distributor({}), TypeError);
			assert.throws(() => new Distributor(() => 1), TypeError);

			assert.doesNotThrow(() => new Distributor([]));
			assert.throws(() => new Distributor([ true ]), TypeError);
			assert.throws(() => new Distributor([ 1 ]), TypeError);
			assert.throws(() => new Distributor([ "1" ]), TypeError);
			assert.throws(() => new Distributor([ Symbol("1") ]), TypeError);
			assert.throws(() => new Distributor([ {} ]), TypeError);
			assert.throws(() => new Distributor([ [] ]), TypeError);
			assert.throws(() => new Distributor([ () => 1 ]), TypeError);

			assert.doesNotThrow(() => new Distributor([ new Consumer(promiseFn) ]));
		});

		it("should return an instance", () => {
			assert(new Distributor() instanceof Distributor);
		});
	});


	describe('#consumers', () => {
		it("should get the consumers", () => {
			const consumerA = new Consumer(promiseFn);
			const consumerB = new Consumer(promiseFn);
			const distributor = new Distributor([ consumerA, consumerB ]);

			const consumers = distributor.consumers;

			assert.strictEqual(consumers.length, 2);
			assert.notStrictEqual(consumers.indexOf(consumerA), -1);
			assert.notStrictEqual(consumers.indexOf(consumerB), -1);
		});

		it("should not get a reference to the consumers", () => {
			const consumer = new Consumer(promiseFn);
			const distributor = new Distributor([ consumer ]);
			const consumers = distributor.consumers;

			assert.notStrictEqual(consumers, distributor.consumers);
		});

		it("should not be settable", () => {
			const distributor = new Distributor();

			assert.throws(() => distributor.consumers = true);
		});
	});


	describe('#hasConsumer', () => {
		it("should accept an consumer as argument", () => {
			const consumer = new Consumer(promiseFn);
			const distributor = new Distributor();

			assert.throws(() => distributor.hasConsumer(), TypeError);
			assert.throws(() => distributor.hasConsumer(true), TypeError);
			assert.throws(() => distributor.hasConsumer(1), TypeError);
			assert.throws(() => distributor.hasConsumer("1"), TypeError);
			assert.throws(() => distributor.hasConsumer(Symbol("1")), TypeError);
			assert.throws(() => distributor.hasConsumer(() => 1), TypeError);
			assert.throws(() => distributor.hasConsumer({}), TypeError);
			assert.throws(() => distributor.hasConsumer([]), TypeError);
			assert.doesNotThrow(() => distributor.hasConsumer(consumer));
		});

		it("should return true if the consumer is referenced", () => {
			const consumerA = new Consumer(promiseFn);
			const consumerB = new Consumer(promiseFn);
			const distributor = new Distributor([ consumerA ]);

			assert.strictEqual(distributor.hasConsumer(consumerA), true);
			assert.strictEqual(distributor.hasConsumer(consumerB), false);
		});
	});

	describe('#addConsumer', () => {
		it("should accept any number of consumers as argument", () => {
			const consumerA = new Consumer(promiseFn);
			const consumerB = new Consumer(promiseFn);
			const consumerC = new Consumer(promiseFn);
			const distributor = new Distributor();

			assert.doesNotThrow(() => distributor.addConsumer());
			assert.throws(() => distributor.addConsumer(true), TypeError);
			assert.throws(() => distributor.addConsumer(1), TypeError);
			assert.throws(() => distributor.addConsumer("1"), TypeError);
			assert.throws(() => distributor.addConsumer(Symbol("1")), TypeError);
			assert.throws(() => distributor.addConsumer(() => 1), TypeError);
			assert.throws(() => distributor.addConsumer({}), TypeError);
			assert.throws(() => distributor.addConsumer([]), TypeError);
			assert.doesNotThrow(() => distributor.addConsumer(consumerA));

			assert.throws(() => distributor.addConsumer(consumerB, true), TypeError);
			assert.doesNotThrow(() => distributor.addConsumer(consumerB, consumerC));
		});

		it("should reference any consumer that is not referenced", () => {
			const consumerA = new Consumer(promiseFn);
			const consumerB = new Consumer(promiseFn);
			const distributor = new Distributor([ consumerA ]);

			distributor.addConsumer(consumerA, consumerB);

			assert.strictEqual(distributor.consumers.length, 2);
			assert.strictEqual(distributor.hasConsumer(consumerA), true);
			assert.strictEqual(distributor.hasConsumer(consumerB), true);
		});

		it("should not mutate when throwing", () => {
			const consumer = new Consumer(promiseFn);
			const distributor = new Distributor();

			try {
				distributor.addConsumer(consumer, true);
			}
			catch (err) {}

			try {
				distributor.addConsumer(true, consumer);
			}
			catch (err) {}

			assert.strictEqual(distributor.consumers.length, 0);
			assert.strictEqual(distributor.hasConsumer(consumer), false);
		});

		it("should be chainable", () => {
			const distributor = new Distributor();

			assert.strictEqual(distributor.addConsumer(), distributor);
		});
	});

	describe('#removeConsumer', () => {
		it("should accept any number of consumers as argument", () => {
			const consumerA = new Consumer(promiseFn);
			const consumerB = new Consumer(promiseFn);
			const consumerC = new Consumer(promiseFn);
			const distributor = new Distributor([
				consumerA,
				consumerB,
				consumerC
			]);

			assert.doesNotThrow(() => distributor.removeConsumer());
			assert.throws(() => distributor.removeConsumer(true), TypeError);
			assert.throws(() => distributor.removeConsumer(1), TypeError);
			assert.throws(() => distributor.removeConsumer("1"), TypeError);
			assert.throws(() => distributor.removeConsumer(Symbol("1")), TypeError);
			assert.throws(() => distributor.removeConsumer(() => 1), TypeError);
			assert.throws(() => distributor.removeConsumer({}), TypeError);
			assert.throws(() => distributor.removeConsumer([]), TypeError);
			assert.doesNotThrow(() => distributor.removeConsumer(consumerA));

			assert.throws(() => distributor.removeConsumer(consumerB, true), TypeError);
			assert.doesNotThrow(() => distributor.removeConsumer(consumerB, consumerC));
		});

		it("should dereference any consumer that is referenced", () => {
			const consumerA = new Consumer(promiseFn);
			const consumerB = new Consumer(promiseFn);
			const distributor = new Distributor([ consumerA ]);

			assert.doesNotThrow(() => distributor.removeConsumer(consumerA, consumerB));
			assert.strictEqual(distributor.consumers.length, 0);
			assert.strictEqual(distributor.hasConsumer(consumerA), false);
			assert.strictEqual(distributor.hasConsumer(consumerB), false);
		});

		it("should not mutate when throwing", () => {
			const consumer = new Consumer(promiseFn);
			const distributor = new Distributor([ consumer ]);

			try {
				distributor.removeConsumer(consumer, true);
			}
			catch (err) {}

			try {
				distributor.removeConsumer(true, consumer);
			}
			catch (err) {}

			assert.strictEqual(distributor.consumers.length, 1);
			assert.strictEqual(distributor.hasConsumer(consumer), true);
		});

		it("should be chainable", () => {
			const distributor = new Distributor();

			assert.strictEqual(distributor.removeConsumer(), distributor);
		});
	});


	describe('#consume', () => {
		it("should accept any object argument", () => {
			const distributor = new Distributor();

			assert.throws(() => distributor.consume(), TypeError);
			assert.throws(() => distributor.consume(null), TypeError);
			assert.throws(() => distributor.consume(true), TypeError);
			assert.throws(() => distributor.consume(1), TypeError);
			assert.throws(() => distributor.consume("1"), TypeError);
			assert.throws(() => distributor.consume(Symbol("1")), TypeError);
			assert.throws(() => distributor.consume(() => 1), TypeError);
			assert.doesNotThrow(() => distributor.consume({}), TypeError);
			assert.doesNotThrow(() => distributor.consume([]), TypeError);
			assert.doesNotThrow(() => distributor.consume(new Date()), TypeError);
		});

		it("should return a promise", () => {
			const consumer = new Consumer(promiseFn);
			const distributor = new Distributor([ consumer ]);
			const ret = distributor.consume({});

			assert(ret instanceof Promise);
		});

		it("should return the result of all consumers", done => {
			const data = {
				a : 1,
				b : 2
			}
			const consumerA = new Consumer(promiseFn);
			const consumerB = new Consumer(promiseFn);
			const distributor = new Distributor([ consumerA, consumerB ]);
			distributor.consume(data)
				.then(value => {
					if (
						value.length === 2 &&
						value[0] === data &&
						value[1] === data
					) done();
					else done(new Error());
				}, why => {
					done(new Error());
				})
		});
	});
});
