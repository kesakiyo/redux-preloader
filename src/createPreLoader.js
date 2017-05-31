import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { connect } from 'react-redux'
import isFunction from 'lodash.isfunction'

export default (defaults = {}) => {

  const getComponentName = component => (
    component.displayName || component.name || 'Component'
  )

  const emptyFunction = () => null

  const objectMap = (obj = {}, state, ownProps) => (
    Object.keys(obj).reduce((ret, key) => ({ ...ret, [key]: obj[key](state, ownProps)}), {})
  )

  return args => {
    const initializer = args.initializer || emptyFunction
    const isLoading = args.isLoading || emptyFunction
    const hasError = args.hasError || emptyFunction
    const LoadingComponent = args.LoadingComponent || defaults.DefaultLoadingComponent || emptyFunction
    const ErrorComponent = args.ErrorComponent || defaults.DefaultErrorComponent || emptyFunction
    const wrapperDisplayName = args.wrapperDisplayName || 'preLoader'

    if (!isFunction(initializer)) {
      throw new Error(`initializer must to be a function, but now is ${typeof initializer}`)
    } else if (!isFunction(isLoading)) {
      throw new Error(`isLoading must to be a function, but now is ${typeof isLoading}`)
    } else if (!isFunction(hasError)) {
      throw new Error(`hasError must to be a function, but now is ${typeof hasError}`)
    }

    return DecoratedComponent => {

      @connect(
        (state, ownProps) => ({
          ...objectMap(defaults.injectToProps, state, ownProps),
          isLoading: isLoading(state, ownProps),
          hasError: hasError(state, ownProps),
        })
      )
      class preLoader extends React.Component {
        constructor() {
          super()
          this.state = {
            forceUnmount: false,
          }
        }

        componentWillMount() {
          this.setState({ forceUnmount: initializer(null, this.props, this.props.dispatch) })
        }

        componentWillReceiveProps(nextProps) {
          this.setState({ forceUnmount: initializer(this.props, nextProps, this.props.dispatch) })
        }

        renderErrorComponent() {
          const { props } = ErrorComponent
          const isJSXComponent = props.prototype instanceof React.Component || props.prototype instanceof React.PureComponent
          if (isJSXComponent) {
            return <ErrorComponent />
          }
          return ErrorComponent(props)
        }

        render() {
          if (this.props.isLoading || this.state.forceUnmount) {
            return <LoadingComponent />
          } else if (this.props.hasError) {
            return this.renderErrorComponent()
          }
          return <DecoratedComponent {...this.props} />
        }
      }

      preLoader.displayName = `${wrapperDisplayName}(${getComponentName(DecoratedComponent)})`

      return hoistStatics(preLoader, DecoratedComponent)
    }
  }
}