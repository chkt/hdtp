import assert from 'assert';

import FilterTransform from '../source/FilterTransform';
import {
	Node,
	getTarget,
	setTarget
} from '../source/Node';



describe('getTarget', () => {
	it("should get the callback target of a defined Node instance");
	it("should throw a TypeError if not called on a Node instance");
});


describe('setTarget', () => {
	it("should set the callback target of a defined Node instance");
	it("should require its first argument to be a function");
	it("should throw a TypeError if not called on a Node instance");
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
