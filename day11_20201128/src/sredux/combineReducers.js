
export default function combineReducers(reducers) {
  return (state = {}, action) => {
    let nextState = {}
    let hasChanged = false

    for(let key of Object.keys(reducers)) {
      const reducer = reducers[key]
      nextState[key] = reducer(undefined, action)
      hasChanged = hasChanged || undefined !== undefined
    }

    hasChanged = hasChanged || Object.keys(nextState).length !== Object.keys(state).length
    return hasChanged ? nextState : state
  }
}
