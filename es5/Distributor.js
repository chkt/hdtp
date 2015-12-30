'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Node2 = require('./Node');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _consumers = new WeakMap();

var Distributor = (function (_Node) {
	_inherits(Distributor, _Node);

	/**
  * Creates a new instance
  * @param {Array} consumers
  */

	function Distributor() {
		var consumers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

		_classCallCheck(this, Distributor);

		if (!Array.isArray(consumers)) throw new TypeError();

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Distributor).call(this, function (data) {
			var consumers = _consumers.get(_this);
			var all = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = consumers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var consumer = _step.value;
					all.push(consumer.consume(data));
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return Promise.all(all);
		}));

		_consumers.set(_this, []);

		_this.addConsumer.apply(_this, _toConsumableArray(consumers));
		return _this;
	}

	/**
  * Gets the consumers of the instance
  * @returns {Consumer[]}
  */

	_createClass(Distributor, [{
		key: 'hasConsumer',

		/**
   * Returns true if the instance has consumer, false otherwise
   * @param {Consumer} consumer
   * @returns {Boolean}
   * @throws {TypeError} if consumer is not a Consumer
   */
		value: function hasConsumer(consumer) {
			if (!(consumer instanceof _Node2.Node)) throw new TypeError();

			return _consumers.get(this).indexOf(consumer) !== -1;
		}

		/**
   * Adds an arbitrary number of consumers to the instance
   * @param {...Consumer} consumer
   * @returns {Distributor}
   * @throws {TypeError} if any consumer is not a Consumer
   */

	}, {
		key: 'addConsumer',
		value: function addConsumer() {
			var consumers = _consumers.get(this).slice(0);

			for (var _len = arguments.length, consumer = Array(_len), _key = 0; _key < _len; _key++) {
				consumer[_key] = arguments[_key];
			}

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = consumer[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;

					if (!(item instanceof _Node2.Node)) throw new TypeError();

					if (consumers.indexOf(item) === -1) consumers.push(item);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
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

	}, {
		key: 'removeConsumer',
		value: function removeConsumer() {
			var consumers = _consumers.get(this).slice(0);

			for (var _len2 = arguments.length, consumer = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				consumer[_key2] = arguments[_key2];
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = consumer[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var item = _step3.value;

					if (!(item instanceof _Node2.Node)) throw new TypeError();

					var index = consumers.indexOf(item);

					if (index !== -1) consumers.splice(index, 1);
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
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

	}, {
		key: 'consume',
		value: function consume(data) {
			if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || data === null) throw new TypeError();

			var consumers = _consumers.get(this);
			var all = [];

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = consumers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var _consumer = _step4.value;
					all.push(_consumer.consume(data));
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return Promise.all(all);
		}
	}, {
		key: 'consumers',
		get: function get() {
			return _consumers.get(this).slice(0);
		}
	}]);

	return Distributor;
})(_Node2.Node);

exports.default = Distributor;