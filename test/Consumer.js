import assert from 'assert';

import Consumer from '../source/Consumer';



describe('Consumer', () => {
	describe('#constructor', () => {
		it("should accept a function as first argument");
		it("should return a new instance");
	});


	describe('#requestTransform', () => {
		it("should be of type FilterTransform");
		it("should be readonly");
	});

	describe('#replyTransform', () => {
		it("should be of type FilterTransform");
		it("should be readonly");
	});


	describe('#target', () => {
		it("should be of type function");
		it("should initially reference the constructor argument");
		it("should reference a function");
		it("should return the referenced function");
	});


	describe('#consume', () => {
		it("should accept any object as first argument");
		it("should return a promise");
		it("should required the target callback to return a promise");
		it("should return a promise resolving to null if aborted inside request filter");
		it("should return a promise resolving to null if aborted inside reply filter");
	});


	describe('.Configure', () => {
		it("should accept a function as first argument");
		it("should optionally accept an array of functions as second argument");
		it("should optionally accept an array of function as tertiary argument");
		it("should return a configured instance");
	});
});
