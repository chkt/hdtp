import {
	Node,
	getTarget,
	setTarget
} from './Node';



const _consumers = new WeakMap();



export default class Distributor extends Node {
	/**
	 * Creates a new instance
	 * @param {Array} consumers
	 */
	constructor(consumers = []) {
		if (!Array.isArray(consumers)) throw new TypeError();

		super(data => {
			const consumers = _consumers.get(this);
			const all = [];

			for (let consumer of consumers) all.push(consumer.consume(data));

			return Promise.all(all);
		});

		_consumers.set(this, []);

		this.addConsumer(...consumers);
	}


	/**
	 * Gets the consumers of the instance
	 * @returns {Consumer[]}
	 */
	get consumers() {
		return _consumers.get(this).slice(0);
	}


	/**
	 * Returns true if the instance has consumer, false otherwise
	 * @param {Consumer} consumer
	 * @returns {Boolean}
	 * @throws {TypeError} if consumer is not a Consumer
	 */
	hasConsumer(consumer) {
		if (!(consumer instanceof Node)) throw new TypeError();

		return _consumers.get(this).indexOf(consumer) !== -1;
	}

	/**
	 * Adds an arbitrary number of consumers to the instance
	 * @param {...Consumer} consumer
	 * @returns {Distributor}
	 * @throws {TypeError} if any consumer is not a Consumer
	 */
	addConsumer(...consumer) {
		const consumers = _consumers.get(this).slice(0);

		for (let item of consumer) {
			if (!(item instanceof Node)) throw new TypeError();

			if (consumers.indexOf(item) === -1) consumers.push(item);
		}

		_consumers.set(this, consumers);

		return this;
	}

	/**
	 * Removes an arbitrary number of consumers from the instance
	 * @param {...Consumer} consumer
	 * @returns {Distributor}
	 * @throws {TypeError} if any consumer is not a Consumer
	 */
	removeConsumer(...consumer) {
		const consumers = _consumers.get(this).slice(0);

		for (let item of consumer) {
			if (!(item instanceof Node)) throw new TypeError();

			const index = consumers.indexOf(item);

			if (index !== -1) consumers.splice(index, 1);
		}

		_consumers.set(this, consumers);

		return this;
	}


	/**
	 * Returns a promise of all dependent consumer responses
	 * @param {Object} data - The Data
	 * @returns {Promise}
	 * @throws {TypeError} if data is not an Object
	 */
	consume(data) {
		if (typeof data !== 'object' || data === null) throw new TypeError();

		const consumers = _consumers.get(this);
		const all = [];

		for (let consumer of consumers) all.push(consumer.consume(data));

		return Promise.all(all);
	}
}
