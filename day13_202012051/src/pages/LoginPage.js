import React, {Component} from 'react'
import {Redirect} from 'react-router'
import {connect} from "react-redux";

@connect(
  // mapStateToProps
  ({user}) => ({isLogin: user.isLogin})
)(
class LoginPage extends Component {
  render() {
    const {isLogin, location} = this.props

    if (isLogin) {
      const {from} = location.state
      return <Redirect to={from}/>
    }
    return (
      <div>
        <h3>LoginPage</h3>
      </div>
    )
  }
}
)

export default LoginPage
