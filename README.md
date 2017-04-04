# redux-preloader
A Higher Order Component that helps to initialize data.


## Installation
```npm install --save redux-preloader```

## API
### preLoader(config: Object)

#### Config properties
* `initializer(props, nextProps, dispatch) (type: Function, return: Bool)`: ```willMount```나 ```willReceiveProps```때 호출됩니다. 이 때 사용자는 ```props```, ```nextProps```를 통해 원하는 상황에서 액션을 생성할 수 있습니다. 때때로 액션을 생성한 뒤 Selector를 통하지 않고 명시적으로 LoadingComponent를 보여주고 싶을 수 있습니다. 이 때 ```initializer```함수에서 ```true```를 반환 한다면 명시적로 현재 컴포넌트를 Loading컴포넌트로 변경할 수 있습니다. 이 외의 경우에는 ```false```를 반환하시면 됩니다. (willMount 일때는 props가 null로 들어옵니다.)

* `isLoading(state, ownProps) (type: Function, return: Bool)`: LoadingComponent를 보여줄 상황을 결정하는 selector입니다. 해당 값이 true라면 LoadingComponent가 보여집니다. 기본 반환값은 false입니다.
* `hasError(state, ownProps) (type: Function, return: Bool)`: ErrorComponent를 보여줄 상황을 결정하는 selector입니다. preLoading이 false일 경우 hasError를 판단합니다. 만약 preLoading이 항상 true라면 ErrorComponent가 render되는 일은 없습니다. 기본 반환값은 false입니다.

* `LoadingComponent (type: Component)`: preLoading이 true일 때 render될 컴포넌트 입니다. 이 때 값으로는 컴포넌트 이름을 넘겨줘야 합니다.(<Error /> 와 같은 형태가 아니라 Error 와 같은 형태) 만약 값을 넘겨주지 않는다면 빈 화면이 출력됩니다.

* `ErrorComponent (type: Component)`: hasError가 true일 때 render될 컴포넌트 입니다. ```LoadingComponent```와 유사하게 동작합니다. 만약 값을 넘겨주지 않는다면 빈 화면이 출력됩니다.

* `wrapperDisplayName (type: String)`: 디버깅 할 때 표시될 display에 표시될 이름을 뜻합니다. 만약 값을 넘겨주지 않는다면 'withPreLoader'의 이름으로 표시됩니다.

## Example
```javascript
import { preLoader } from 'redux-preloader'

const initializer = (props, nextProps, dispatch) => {
  const id = selectn('id', props)
  const nextId = selectn('id', nextProps)
  if (id !== nextId) {
    dispatch(/** Your async action **/)
    return true
  }
  return false
}

@preLoader({
  initializer,
  isLoading: (state, ownProps) => state.isFetching,
  hasError: (state, ownProps) => state.hasError,
  LoadingComponent: YourLoadingComponent,
  ErrorComponent: YourErrorComponent,
})
class YourClass extends from React.Component {
  ...
}
```
