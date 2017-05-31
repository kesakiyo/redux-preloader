'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _reactRedux = require('react-redux');

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function () {
  var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  var getComponentName = function getComponentName(component) {
    return component.displayName || component.name || 'Component';
  };

  var emptyFunction = function emptyFunction() {
    return null;
  };

  var objectMap = function objectMap() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var state = arguments[1];
    var ownProps = arguments[2];
    return Object.keys(obj).reduce(function (ret, key) {
      return _extends({}, ret, _defineProperty({}, key, obj[key](state, ownProps)));
    }, {});
  };

  return function (args) {
    var initializer = args.initializer || emptyFunction;
    var isLoading = args.isLoading || emptyFunction;
    var hasError = args.hasError || emptyFunction;
    var LoadingComponent = args.LoadingComponent || defaults.DefaultLoadingComponent || emptyFunction;
    var ErrorComponent = args.ErrorComponent || defaults.DefaultErrorComponent || emptyFunction;
    var wrapperDisplayName = args.wrapperDisplayName || 'preLoader';

    if (!(0, _lodash2.default)(initializer)) {
      throw new Error('initializer must to be a function, but now is ' + (typeof initializer === 'undefined' ? 'undefined' : _typeof(initializer)));
    } else if (!(0, _lodash2.default)(isLoading)) {
      throw new Error('isLoading must to be a function, but now is ' + (typeof isLoading === 'undefined' ? 'undefined' : _typeof(isLoading)));
    } else if (!(0, _lodash2.default)(hasError)) {
      throw new Error('hasError must to be a function, but now is ' + (typeof hasError === 'undefined' ? 'undefined' : _typeof(hasError)));
    }

    return function (DecoratedComponent) {
      var _dec, _class;

      var preLoader = (_dec = (0, _reactRedux.connect)(function (state, ownProps) {
        return _extends({}, objectMap(defaults.injectToProps, state, ownProps), {
          isLoading: isLoading(state, ownProps),
          hasError: hasError(state, ownProps)
        });
      }), _dec(_class = function (_React$Component) {
        _inherits(preLoader, _React$Component);

        function preLoader() {
          _classCallCheck(this, preLoader);

          var _this = _possibleConstructorReturn(this, (preLoader.__proto__ || Object.getPrototypeOf(preLoader)).call(this));

          _this.state = {
            forceUnmount: false
          };
          return _this;
        }

        _createClass(preLoader, [{
          key: 'componentWillMount',
          value: function componentWillMount() {
            this.setState({ forceUnmount: initializer(null, this.props, this.props.dispatch) });
          }
        }, {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            this.setState({ forceUnmount: initializer(this.props, nextProps, this.props.dispatch) });
          }
        }, {
          key: 'renderErrorComponent',
          value: function renderErrorComponent() {
            var isJSXComponent = ErrorComponent.prototype instanceof _react2.default.Component || ErrorComponent.prototype instanceof _react2.default.PureComponent;
            if (isJSXComponent) {
              return _react2.default.createElement(ErrorComponent, null);
            }
            return ErrorComponent(this.props);
          }
        }, {
          key: 'render',
          value: function render() {
            if (this.props.isLoading || this.state.forceUnmount) {
              return _react2.default.createElement(LoadingComponent, null);
            } else if (this.props.hasError) {
              return this.renderErrorComponent();
            }
            return _react2.default.createElement(DecoratedComponent, this.props);
          }
        }]);

        return preLoader;
      }(_react2.default.Component)) || _class);


      preLoader.displayName = wrapperDisplayName + '(' + getComponentName(DecoratedComponent) + ')';

      return (0, _hoistNonReactStatics2.default)(preLoader, DecoratedComponent);
    };
  };
};