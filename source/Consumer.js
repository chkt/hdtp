import Filter from './FilterTransform';



const _target = new WeakMap();

const _requestTransform = new WeakMap();
const _replyTransform = new WeakMap();



export default class Consumer {

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
	 * Creates a new instance
	 * @param {Function} fn - The callback
	 * @throws {TypeError} if fn is not a Function
	 */
	constructor(fn) {
		if (typeof fn !== 'function') throw new TypeError();

		_target.set(this, fn);

		_requestTransform.set(this, new Filter());
		_replyTransform.set(this, new Filter());
	}


	/**
	 * Gets the request filter
	 * @returns {Filter}
	 */
	get requestTransform() {
		return _requestTransform.get(this);
	}

	/**
	 * Gets the reply filter
	 * @returns {Filter}
	 */
	get replyTransform() {
		return _replyTransform.get(this);
	}


	/**
	 * Gets the target callback
	 * @returns {Function}
	 */
	get target() {
		return _target.get(this);
	}

	/**
	 * Sets the target callback
	 * @param {Function} fn
	 * @throws {TypeError} if fn is not a Function
	 */
	set target(fn) {
		if (typeof fn !== 'function') throw new TypeError();

		_target.set(this, fn);
	}


	/**
	 * Returns a promise representing the transformed result
	 * @param {Object} data - The request data
	 * @returns {Promise}
	 * @throws {TypeError} if data is not an Object
	 * @throws {ReferenceError} if the callback return value is not a Promise
	 */
	consume(data) {
		if (!(data instanceof Object)) throw new TypeError();

		data = _requestTransform.get(this).process(data);

		if (data === null) return Promise.resolve(null);

		let p = _target.get(this)(data);

		if (!(p instanceof Promise)) throw new ReferenceError();

		return p.then(data => _replyTransform.get(this).process(data));
	}
}
