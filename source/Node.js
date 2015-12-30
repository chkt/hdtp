import Filter from './FilterTransform';



const _target = new WeakMap();

const _requestTransform = new WeakMap();
const _replyTransform = new WeakMap();



/**
 * Returns the target callback associated with this
 * @returns {Function}
 * @throws {TypeError} if this is not a Node instance
 */
export function getTarget() {
	if (!(this instanceof Node)) throw new TypeError();

	return _target.get(this);
}

/**
 * Sets the target callback associated with this
 * @param {Function} fn
 * @returns {Node}
 * @throws {TypeError} if this is not a Node instance
 * @throws {TypeError} if fn is not a function
 */
export function setTarget(fn) {
	if (
		!(this instanceof Node) ||
		typeof fn !== 'function'
	) throw new TypeError();

	_target.set(this, fn);

	return this;
}



export class Node {
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
