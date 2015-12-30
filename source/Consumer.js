import {
	Node,
	getTarget,
	setTarget
} from './Node';



export default class Consumer extends Node {

	/**
	 * Returns a configured instance
	 * @param {Function} fn - The callback function
	 * @param {Function[]} [request=[]] - The request transforms
	 * @param {Function[]} [reply=[]] - The reply transforms
	 * @returns {Consumer}
	 * @constructor
	 */
	static Configure(fn, request = [], reply = []) {
		if (
			!Array.isArray(request) ||
			!Array.isArray(reply)
		) throw new TypeError();

		const res = new Consumer(fn);

		res.requestTransform.append(...request);
		res.replyTransform.append(...reply);

		return res;
	}



	/**
	 * Gets the target callback
	 * @returns {Function}
	 */
	get target() {
		return getTarget.call(this);
	}

	/**
	 * Sets the target callback
	 * @param {Function} fn
	 * @throws {TypeError} if fn is not a Function
	 */
	set target(fn) {
		setTarget.call(this, fn);
	}
}
