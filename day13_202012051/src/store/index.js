import {createStore, combineReducers} from 'redux'
import {loginReducer} from "./loginReducer";

const store = createStore(combineReducers(loginReducer))

export default store
