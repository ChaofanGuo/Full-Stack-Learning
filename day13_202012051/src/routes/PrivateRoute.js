import React from 'react'
import {Route, Redirect} from 'react-router'
import {connect} from 'react-redux'

export default connect(
  ({user}) => ({isLogin: user.isLogin})
)(function PrivateRoute ({isLogin, path, component: Component, ...restProps}) {
  return (
    <Route {...restProps} render={props => isLogin ? (<Component {...props} />) : (<Redirect to={{pathname: '/login', state: {form: props.location.pathname}}} />)} />
  )
})
