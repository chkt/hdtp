'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Node2 = require('./Node');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Consumer = (function (_Node) {
	_inherits(Consumer, _Node);

	function Consumer() {
		_classCallCheck(this, Consumer);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Consumer).apply(this, arguments));
	}

	_createClass(Consumer, [{
		key: 'target',

		/**
   * Gets the target callback
   * @returns {Function}
   */
		get: function get() {
			return _Node2.getTarget.call(this);
		}

		/**
   * Sets the target callback
   * @param {Function} fn
   * @throws {TypeError} if fn is not a Function
   */
		,
		set: function set(fn) {
			_Node2.setTarget.call(this, fn);
		}
	}], [{
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

			if (!Array.isArray(request) || !Array.isArray(reply)) throw new TypeError();

			var res = new Consumer(fn);

			(_res$requestTransform = res.requestTransform).append.apply(_res$requestTransform, _toConsumableArray(request));
			(_res$replyTransform = res.replyTransform).append.apply(_res$replyTransform, _toConsumableArray(reply));

			return res;
		}
	}]);

	return Consumer;
})(_Node2.Node);

exports.default = Consumer;