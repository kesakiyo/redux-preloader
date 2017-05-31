'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preLoader = exports.createPreLoader = undefined;

var _createPreLoader = require('./createPreLoader');

var _createPreLoader2 = _interopRequireDefault(_createPreLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var preLoader = (0, _createPreLoader2.default)();

exports.createPreLoader = _createPreLoader2.default;
exports.preLoader = preLoader;