import assert from 'assert';

import Distributor from '../source/Distributor';



describe('Distributor', () => {

	describe('#constructor', () => {
		it("should not require any arguments");
		it("should accept an array of consumers as first argument");
		it("should return an instance");
	});


	describe('#hasConsumer', () => {
		it("should accept an consumer as argument");
		it("should return true if the consumer is referenced");
	});

	describe('#addConsumer', () => {
		it("should accept any number of consumers as argument");
		it("should reference any consumer that is not referenced");
		it("should only reference any consumer once");
		it("should not mutate when throwing");
		it("should be chainable");
	});

	describe('#removeConsumer', () => {
		it("should accept any number of consumers as argument");
		it("should dereference any consumer that is referenced");
		it("should not mutate when throwing");
		it("should be chainable");
	});


	describe('#send', () => {
		it("should accept an object argument");
		it("should return a promise");
		it("should return the result of all consumers");
	});
});
