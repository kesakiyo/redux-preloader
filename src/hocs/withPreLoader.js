import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { connect } from 'react-redux'

const defaults = {
  preLoader: null,
  preLoading: () => false,
  hasError: () => false,
  LoadingComponent: () => null,
  ErrorComponent: () => null,
  wrapperDisplayName: 'withPreLoader',
}

export default args => {
  const {
    preLoader,
    preLoading,
    hasError,
    LoadingComponent,
    ErrorComponent,
    wrapperDisplayName,
  } = { ...defaults, ...args }

  const getComponentName = component => (
    component.displayName || component.name || 'Component'
  )

  return DecoratedComponent => {

    @connect(
      (state, ownProps) => ({
        preLoading: preLoading(state, ownProps),
        hasError: hasError(state, ownProps),
      })
    )
    class withPreLoader extends React.Component {
      constructor() {
        super()
        this.state = {
          forceUnmount: false,
        }
      }

      componentWillMount() {
        this.setState({ forceUnmount: preLoader(null, this.props, this.props.dispatch) })
      }

      componentWillReceiveProps(nextProps) {
        this.setState({ forceUnmount: preLoader(this.props, nextProps, this.props.dispatch) })
      }

      render() {
        if (this.props.preLoading || this.state.forceUnmount) {
          return <LoadingComponent />
        } else if (this.props.hasError) {
          return <ErrorComponent />
        }
        return <DecoratedComponent {...this.props} />
      }
    }

    withPreLoader.displayName = `${wrapperDisplayName}(${getComponentName(DecoratedComponent)})`

    return hoistStatics(withPreLoader, DecoratedComponent)
  }
}