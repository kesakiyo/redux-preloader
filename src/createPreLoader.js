/* External dependencies */
import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
import isFunction from 'lodash.isfunction';
import isBoolean from 'lodash.isboolean';

export default (defaults = {}) => {
  const getComponentName = component => (
    component.displayName || component.name || 'Component'
  );

  const emptyFunction = () => null;

  const objectMap = (obj = {}, state, ownProps) => (
    Object.keys(obj).reduce((ret, key) => ({ ...ret, [key]: obj[key](state, ownProps) }), {})
  );


  const isJSXComponent = Component => (
    Component.prototype instanceof React.Component || Component.prototype instanceof React.PureComponent
  );

  return (args) => {
    const initializer = args.initializer || emptyFunction;
    const isLoading = args.isLoading || emptyFunction;
    const hasError = args.hasError || emptyFunction;
    const showLoaderAlways = isBoolean(args.showLoaderAlways) ? args.showLoaderAlways : true;
    const LoadingComponent = args.LoadingComponent || defaults.DefaultLoadingComponent || emptyFunction;
    const ErrorComponent = args.ErrorComponent || defaults.DefaultErrorComponent || emptyFunction;
    const wrapperDisplayName = args.wrapperDisplayName || 'preLoader';

    if (!isFunction(initializer)) {
      throw new Error(`initializer must to be a function, but now is ${typeof initializer}`);
    } else if (!isFunction(isLoading)) {
      throw new Error(`isLoading must to be a function, but now is ${typeof isLoading}`);
    } else if (!isFunction(hasError)) {
      throw new Error(`hasError must to be a function, but now is ${typeof hasError}`);
    }

    return (DecoratedComponent) => {
      @connect((state, ownProps) => ({
        ...objectMap(defaults.injectToProps, state, ownProps),
        ...objectMap(args.injectToProps, state, ownProps),
        isLoading: isLoading(state, ownProps),
        hasError: hasError(state, ownProps),
        showLoaderAlways,
      }))
      class preLoader extends React.Component {
        constructor() {
          super();
          this.state = {
            forceUnmount: false,
          };
          this.hasLoaded = false;
        }

        componentWillMount() {
          this.setState({ forceUnmount: initializer(null, this.props, this.props.dispatch) });
        }

        componentWillReceiveProps(nextProps) {
          this.setState({ forceUnmount: initializer(this.props, nextProps, this.props.dispatch) });
        }

        renderComponent(Component) {
          if (isJSXComponent(Component)) {
            return <Component {...this.props} />;
          }

          const JSXComponent = Component(this.props);

          if (JSXComponent && isJSXComponent(JSXComponent)) {
            return <JSXComponent />;
          }

          return JSXComponent;
        }

        render() {
          if (((!this.hasLoaded || this.props.showLoaderAlways) && this.props.isLoading) || this.state.forceUnmount) {
            if (this.props.isLoading) this.hasLoaded = true;
            return this.renderComponent(LoadingComponent);
          } else if (this.props.hasError) {
            return this.renderComponent(ErrorComponent);
          }
          return <DecoratedComponent {...this.props} />;
        }
      }

      preLoader.displayName = `${wrapperDisplayName}(${getComponentName(DecoratedComponent)})`;

      return hoistStatics(preLoader, DecoratedComponent);
    };
  };
};
