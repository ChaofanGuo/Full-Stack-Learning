// 橙子
export default function combineReducers(reducers) {
  return (state = {}, actionj) => {
    let nextState = {}
    let hasChanged = false

    for(let key of Object.keys(reducers)) {
      const reducer = reducers[key]
      nextState[key] = reducer(state[key], action)
      hasChanged = hasChanged || nextState[key] !== state[key]
    }

    hasChanged = hasChanged || Object.keys(nextState).length !== Object.keys(state).length
    return hasChanged ? nextState : state
  }
}
