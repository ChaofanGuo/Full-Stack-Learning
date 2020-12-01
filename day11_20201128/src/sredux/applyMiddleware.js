
export default function applyMiddleware(...middlewares) {
  return createStore => reducer => {
    const store = createStore(reducer)
    let dispatch = store.dispatch

    const midApi = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }

    const middlewareChain = middlewares.map(middleware => middleware(midApi))

    dispatch = compose(...middlewareChain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}

function compose(...fns) {
  if (fns.length === 0) {
    return arg => arg
  }

  if (fns.length === 1) {
    return fns[0]
  }

  return fns.reduce((a, b) => (...args) => a(b(...args)))
}
