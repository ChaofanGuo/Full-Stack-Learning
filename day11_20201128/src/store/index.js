// import {applyMiddleware, createStore} from "redux";
import {createStore, applyMiddleware, combineReducers} from '../sredux'
// import thunk from "redux-thunk";
// import logger from 'redux-logger'

export const counterReducer = (state = 0, {type, payload = 1}) => {
  switch(type) {
    case 'ADD':
      return state + payload
    case 'MINUS':
      return state - payload || 1
    default:
      return state
  }
}

// const store = createStore(counterReducer, applyMiddleware(thunk, logger))
const store = createStore(
  combineReducers({count: counterReducer}),
  applyMiddleware(thunk, logger)
)

export default store

function logger({getState, dispatch}) {
  return next => action => {
    console.log('-- Logger Start --')
    let prevState = getState()
    console.log('prev state', prevState)

    const returnValue = next(action)

    let nextState = getState()
    console.log('next state', nextState)
    console.log('-- Logger End --')

    return returnValue
  }
}

function thunk({getState, dispatch}) {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    return next(action)
  }
}
