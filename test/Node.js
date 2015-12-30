import assert from 'assert';

import FilterTransform from '../source/FilterTransform';
import {
	Node,
	getTarget,
	setTarget
} from '../source/Node';



describe('getTarget', () => {
	it("should get the callback target of a defined Node instance", () => {
		const fn = data => Promise.resolve(data);
		const node = new Node(fn);

		assert.strictEqual(fn, getTarget.call(node));
	});

	it("should throw a TypeError if not called on a Node instance", () => {
		assert.throws(() => getTarget(), TypeError);
		assert.throws(() => getTarget.call(true), TypeError);
		assert.throws(() => getTarget.call(1), TypeError);
		assert.throws(() => getTarget.call("1"), TypeError);
		assert.throws(() => getTarget.call({}), TypeError);
	});
});


describe('setTarget', done => {
	it("should set the callback target of a defined Node instance", () => {
		const fn = data => Promise.resolve("1");
		const node = new Node(data => Promise.resolve(data));

		setTarget.call(node, fn);

		node
			.consume({})
			.then((data) => {
				if (data === "1") done();
				else done(new Error(data));
			}, why => {
				done(new Error(why));
			});
	});

	it("should require its first argument to be a function", () => {
		const node = new Node(data => Promise.resolve(data));

		assert.throws(() => setTarget.call(node, true), TypeError);
		assert.throws(() => setTarget.call(node, 1), TypeError);
		assert.throws(() => setTarget.call(node, "1"), TypeError);
		assert.throws(() => setTarget.call(node, Symbol()), TypeError);
		assert.doesNotThrow(() => setTarget.call(node, data => new Promise(data)));
		assert.throws(() => setTarget.call(node, {}), TypeError);
		assert.throws(() => setTarget.call(node, []), TypeError);
	});

	it("should throw a TypeError if not called on a Node instance", () => {
		const fn = data => new Promise(data);

		assert.throws(() => setTarget(fn), TypeError);
		assert.throws(() => setTarget.call(true, fn), TypeError);
		assert.throws(() => setTarget.call(1, fn), TypeError);
		assert.throws(() => setTarget.call("1", fn), TypeError);
		assert.throws(() => setTarget.call({}, fn), TypeError);
	});
});


describe('Node', () => {
	describe('#constructor', () => {
		it("should accept a function as first argument", () => {
			assert.throws(() => new Node(), TypeError);
			assert.throws(() => new Node(true), TypeError);
			assert.throws(() => new Node(1), TypeError);
			assert.throws(() => new Node("1"), TypeError);
			assert.throws(() => new Node(Symbol()), TypeError);
			assert.throws(() => new Node({}), TypeError);
			assert.throws(() => new Node([]), TypeError);
			assert.doesNotThrow(() => new Node(data => 1));
		});

		it("should return a new instance", () => {
			const node = new Node(data => 1);

			assert(node instanceof Node);
		});
	});


	describe('#requestTransform', () => {
		it("should be of type FilterTransform", () => {
			const node = new Node(data => 1);

			assert(node.requestTransform instanceof FilterTransform);
		});

		it("should be readonly", () => {
			const node = new Node(data => 1);

			assert.throws(() => node.requestTransform = true);
		});
	});

	describe('#replyTransform', () => {
		it("should be of type FilterTransform", () => {
			const node = new Node(data => 1);

			assert(node.replyTransform instanceof FilterTransform);
		});

		it("should be readonly", () => {
			const node = new Node(data => 1);

			assert.throws(() => node.replyTransform = true);
		});
	});


	describe('#consume', () => {
		it("should accept any object as first argument", () => {
			const node = new Node(data => Promise.resolve(data));

			assert.throws(() => node.consume(true), TypeError);
			assert.throws(() => node.consume(1), TypeError);
			assert.throws(() => node.consume("1"), TypeError);
			assert.throws(() => node.consume(Symbol()), TypeError);
			assert.throws(() => node.consume(null));
			assert.doesNotThrow(() => node.consume({}));
			assert.doesNotThrow(() => node.consume([]));
			assert.doesNotThrow(() => node.consume(() => 1));
			assert.throws(() => node.consume(undefined));
			assert.throws(() => node.consume(NaN));
		});

		it("should return a promise", () => {
			const node = new Node(data => Promise.resolve(data));
			const ret = node.consume({});

			assert(ret instanceof Promise);
		});

		it("should require the target callback to return a promise", () => {
			assert.throws(() => new Node(data => 1).consume({}), ReferenceError);
			assert.throws(() => new Node(data => ({})).consume({}), ReferenceError);
			assert.doesNotThrow(() => new Node(data => Promise.resolve(data)));
		});

		it("should return a promise resolving to null if aborted inside request filter", done => {
			const node = new Node(data => Promise.resolve(data));

			node.requestTransform.append(data => null);
			node.consume({})
				.then(val => {
					if (val === null) done();
					else done(new Error());
				}, why => {
					done(new Error());
				});
		});

		it("should return a promise resolving to null if aborted inside reply filter", done => {
			const node = new Node(data => Promise.resolve(data));

			node.replyTransform.append(data => null);
			node.consume({})
				.then(val => {
					if (val === null) done();
					else done(new Error());
				}, why => {
					done(new Error());
				});
		});
	});
});
