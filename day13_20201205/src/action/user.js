import {LOGIN_FAILURE, LOGIN_SUCCESS, REQUEST} from "./const";
import {} from 'redux-thunk'
import LoginService from "../service/login";

// export const login = userInfo => ({type: LOGIN_SUCCESS, payload: userInfo});

/*
export const login = userInfo => dispatch => {
  dispatch({type: REQUEST})
  LoginService.login(userInfo).then(res => {
    // dispatch({type: LOGIN_SUCCESS, payload: res})
    getMoreUserInfo(dispatch, res)
  }, err => {
    dispatch({type: LOGIN_FAILURE, payload: err})
  })
}
 */

const getMoreUserInfo = (dispatch, userInfo) => {
  LoginService.getMoreUserInfo(userInfo).then(res => {
    dispatch({type: LOGIN_SUCCESS, payload: res})
  }, err => {
    dispatch({type: LOGIN_FAILURE, payload: err})
  })
}


const loginPromise = (dispatch, userInfo) => {
  return LoginService.login(userInfo).then(res => {
    // dispatch({type: LOGIN_SUCCESS, payload: res})
    return res
  }, err => {
    dispatch({type: LOGIN_FAILURE, payload: err})
  })
}

export function login(userInfo) {
  return async function(dispatch) {
    dispatch({type: REQUEST})
    let res = await loginPromise(dispatch, userInfo)
    if (res) {
      getMoreUserInfo(dispatch, res)
    }
  }
}


export const logout = userInfo => ({})
