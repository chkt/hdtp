'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Node = undefined;
exports.getTarget = getTarget;
exports.setTarget = setTarget;

var _FilterTransform = require('./FilterTransform');

var _FilterTransform2 = _interopRequireDefault(_FilterTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _target = new WeakMap();

var _requestTransform = new WeakMap();
var _replyTransform = new WeakMap();

/**
 * Returns the target callback associated with this
 * @returns {Function}
 * @throws {TypeError} if this is not a Node instance
 */
function getTarget() {
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
function setTarget(fn) {
	if (!(this instanceof Node) || typeof fn !== 'function') throw new TypeError();

	_target.set(this, fn);

	return this;
}

var Node = exports.Node = (function () {
	/**
  * Creates a new instance
  * @param {Function} fn - The callback
  * @throws {TypeError} if fn is not a Function
  */

	function Node(fn) {
		_classCallCheck(this, Node);

		if (typeof fn !== 'function') throw new TypeError();

		_target.set(this, fn);

		_requestTransform.set(this, new _FilterTransform2.default());
		_replyTransform.set(this, new _FilterTransform2.default());
	}

	/**
  * Gets the request filter
  * @returns {Filter}
  */

	_createClass(Node, [{
		key: 'consume',

		/**
   * Returns a promise representing the transformed result
   * @param {Object} data - The request data
   * @returns {Promise}
   * @throws {TypeError} if data is not an Object
   * @throws {ReferenceError} if the callback return value is not a Promise
   */
		value: function consume(data) {
			var _this = this;

			if (!(data instanceof Object)) throw new TypeError();

			data = _requestTransform.get(this).process(data);

			if (data === null) return Promise.resolve(null);

			var p = _target.get(this)(data);

			if (!(p instanceof Promise)) throw new ReferenceError();

			return p.then(function (data) {
				return _replyTransform.get(_this).process(data);
			});
		}
	}, {
		key: 'requestTransform',
		get: function get() {
			return _requestTransform.get(this);
		}

		/**
   * Gets the reply filter
   * @returns {Filter}
   */

	}, {
		key: 'replyTransform',
		get: function get() {
			return _replyTransform.get(this);
		}
	}]);

	return Node;
})();