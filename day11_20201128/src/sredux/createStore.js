
export default function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer)
  }

  let currentState
  let currentListeners = new Set()

  function getState() {
    return currentState
  }

  function subscribe(listener) {
    currentListeners.add(listener)
    return () => {
      currentListeners.delete(listener)
    }
  }

  function dispatch(action) {
    currentState = reducer(currentState, action)
    callListeners()
  }

  function callListeners() {
    for(let listener of currentListeners) {
      listener()
    }
  }

  dispatch({type: 'SREDUX?LAKSJDIFOI2J3FI9JAS09DFU0293U908HTAOSDIURF98A7SD908F7'})

  return {
    getState,
    subscribe,
    dispatch
  }
}

