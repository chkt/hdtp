'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _FilterTransform = require('./FilterTransform');

var _FilterTransform2 = _interopRequireDefault(_FilterTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _target = new WeakMap();

var _requestTransform = new WeakMap();
var _replyTransform = new WeakMap();

var Consumer = (function () {
	_createClass(Consumer, null, [{
		key: 'Configure',

		/**
   * Returns a configured instance
   * @param {Function} fn - The callback function
   * @param {Function[]} [request=[]] - The request transforms
   * @param {Function[]} [reply=[]] - The reply transforms
   * @returns {Consumer}
   * @constructor
   */
		value: function Configure(fn) {
			var _res$requestTransform, _res$replyTransform;

			var request = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
			var reply = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

			var res = new Consumer(fn);

			(_res$requestTransform = res.requestTransform).append.apply(_res$requestTransform, _toConsumableArray(request));
			(_res$replyTransform = res.replyTransform).append.apply(_res$replyTransform, _toConsumableArray(reply));

			return res;
		}

		/**
   * Creates a new instance
   * @param {Function} fn - The callback
   * @throws {TypeError} if fn is not a Function
   */

	}]);

	function Consumer(fn) {
		_classCallCheck(this, Consumer);

		if (typeof fn !== 'function') throw new TypeError();

		_requestTransform.set(this, new _FilterTransform2.default());
		_replyTransform.set(this, new _FilterTransform2.default());
	}

	/**
  * Gets the request filter
  * @returns {Filter}
  */

	_createClass(Consumer, [{
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

		/**
   * Gets the target callback
   * @returns {Function}
   */

	}, {
		key: 'target',
		get: function get() {
			return _target.get(this);
		}

		/**
   * Sets the target callback
   * @param {Function} fn
   * @throws {TypeError} if fn is not a Function
   */
		,
		set: function set(fn) {
			if (typeof fn !== 'function') throw new TypeError();

			_target.set(this, fn);
		}
	}]);

	return Consumer;
})();

exports.default = Consumer;