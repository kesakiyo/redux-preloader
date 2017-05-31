# redux-preloader
A Higher Order Component that helps to initialize data.


## Installation
```npm install --save redux-preloader```

## API
### preLoader(config: Object)

#### Config properties
* `initializer(props, nextProps, dispatch) (type: Function, return: Bool)`: ```willMount```나 ```willReceiveProps```때 호출됩니다. 이 때 사용자는 ```props```, ```nextProps```를 통해 원하는 상황에서 액션을 생성할 수 있습니다. 때때로 액션을 생성한 뒤 Selector를 통하지 않고 명시적으로 LoadingComponent를 보여주고 싶을 수 있습니다. 이 때 ```initializer```함수에서 ```true```를 반환 한다면 명시적로 현재 컴포넌트를 Loading컴포넌트로 변경할 수 있습니다. 이 외의 경우에는 ```false```를 반환하시면 됩니다. (willMount 일때는 props가 null로 들어옵니다.)

* `injectToProps (type: Object => [key: String, value: Function])`: preLoader에서 initializer가 호출 될 때 Store에서 추가로 내려받고 싶은 정보가 있을 수 있습니다. 이 때 원하는 정보들을 Object에 명시해주면 됩니다. 
Object의 key는 props로 내려줄 key를 의미합니다. Object의 value는 Selector function으로 Store에서 가져올 정보들을 의미합니다. 자세한 예제는 Example을 참고해주세요.

* `isLoading(state, ownProps) (type: Function, return: Bool)`: LoadingComponent를 보여줄 상황을 결정하는 selector입니다. 해당 값이 true라면 LoadingComponent가 보여집니다. 기본 반환값은 false입니다.
* `hasError(state, ownProps) (type: Function, return: Bool)`: ErrorComponent를 보여줄 상황을 결정하는 selector입니다. preLoading이 false일 경우 hasError를 판단합니다. 만약 preLoading이 항상 true라면 ErrorComponent가 render되는 일은 없습니다. 기본 반환값은 false입니다.

* `LoadingComponent (type: Component)`: preLoading이 true일 때 render될 컴포넌트 입니다. 이 때 값으로는 컴포넌트 이름을 넘겨줘야 합니다.(\<Error \/\> 와 같은 형태가 아니라 Error 와 같은 형태) 만약 값을 넘겨주지 않는다면 빈 화면이 출력됩니다.

* `ErrorComponent (type: Component or Function)`: hasError가 true일 때 render될 컴포넌트를 결정합니다. ```LoadingComponent```와 유사하게 동작합니다. 리액트 컴포넌트대신 함수를 넣는다면 argument로 props를 넘겨줍니다. 이 함수 내에서 render할 ErrorComponent를 결정할 수 있습니다. 만약 아무값도 넘기지 않는다면 빈 화면이 출력됩니다.

* `wrapperDisplayName (type: String)`: 디버깅 할 때 표시될 display에 표시될 이름을 뜻합니다. 만약 값을 넘겨주지 않는다면 'withPreLoader'의 이름으로 표시됩니다.

### createPreLoader(config: Object)
> 기본으로 제공해주는 preLoader를 사용하는것도 좋지만 좀 더 커스터마이징 된 preLoader를 사용하고 싶을때도 있습니다. 이 때 사용할 수 있는 API입니다.
이 API는 몇 가지 기본 설정을 가진 preLoader를 생성하는 함수입니다.

#### Config properties
* `DefaultLoadingComponent (type: Component)`: preLoader에서 LoadingComponent를 정해주지 않는다면 isLoading이 true일 때 기본으로 사용하게 될 컴포넌트입니다.
 
* `DefaultErrorComponent (type: Component)`: preLoader에서 ErrorComponent를 정해주지 않는다면 hasError가 true일 때 기본으로 사용하게 될 컴포넌트 입니다

* `injectToProps (type: Object => [key: String, value: Function])`: preLoader에서 initializer가 호출 될 때 Store에서 추가로 내려받고 싶은 정보가 있을 수 있습니다. 이 때 원하는 정보들을 Object에 명시해주면 됩니다. 
Object의 key는 props로 내려줄 key를 의미합니다. Object의 value는 Selector function으로 Store에서 가져올 정보들을 의미합니다. 자세한 예제는 Example을 참고해주세요.

## Example

### es7 + decorator
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
class YourClass extends React.Component {
  ...
}

export default YourClass
```

### es6
```javascript
import { preLoader } from 'redux-preloader'

class YourClass extends React.Component {
  ...
}

const initializer = (props, nextProps, dispatch) => {
  const id = selectn('id', props)
  const nextId = selectn('id', nextProps)
  if (id !== nextId) {
    dispatch(/** Your async action **/)
    return true
  }
  return false
}

export default preLoader({
  initializer,
  isLoading: (state, ownProps) => state.isFetching,
  hasError: (state, ownProps) => state.hasError,
  LoadingComponent: YourLoadingComponent,
  ErrorComponent: YourErrorComponent,
})(YourClass)
```
### createPreLoader + es7 + decorator
```javascript
import { createPreLoader } from 'redux-prealoder'

const customPreLoader = createPreLoader({
  DefaultLoadingComponent: YourDefaultLoadingComponent,
  DefaultErrorComponent: YourDefaultErrorComponent,
  injectToProps: {
    socketStatus: (state, ownProps) => state.socketStatus
  }
})

const initializer = (props, nextProps, dispatch) => {
  // injectToProps에 socketStatus를 명시해줘서 initializer에서 사용이 가능합니다
  const status = selectn('socketStatus', props)
  const nextStatus = selectn('socketStatus', nextProps)
  if (status !== nextStatus) {
    dispatch(/** Your async action **/)
    return true
  }
  return false
}

/*
  DefaultLoadingComponent, DefaultErrorComponent를 설정해 줬기 때문에
  따로 설정을 안해줘도 원하는 컴포넌트가 보입니다.
  만약 Default가 아닌 다른 컴포넌트를 보여주고 싶다면 다른 컴포넌트를 명시해주시면 됩니다.
*/
@customPreLoader({
  initializer,
  isLoading: (state, ownProps) => state.isFetching,
  hasError: (state, ownProps) => state.hasError,
})
class YourClass extends React.Component {
  ...
}
```