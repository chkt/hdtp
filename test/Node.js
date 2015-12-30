import assert from 'assert';

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
		it("should accept a function as first argument");
		it("should return a new instance");
	});

	describe("#requestTransform", () => {
		it("should be of type FilterTransform");
		it("should be readonly");
	});

	describe("#replyTransform", () => {
		it("should be of type FilterTransform");
		it("should be readonly");
	});

	describe("#consume", () => {
		it("should accept any object as first argument");
		it("should return a promise");
		it("should require the target callback to return a promise");
		it("should return a promise resolving to null if aborted inside request filter");
		it("should return a promise resolving to null if aborted inside reply filter");
	});
});
