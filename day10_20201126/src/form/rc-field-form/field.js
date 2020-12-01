import React from 'react'
import FieldContext from "./fieldContext";

function GetErrMessage (props) {
  const {message} = props
  if (message) {
    return (
      <div style={{color: 'red'}}>
        <span>{message}</span>
      </div>
    )
  } else {
    return null
  }
}

export default class Field extends React.Component {
  static contextType = FieldContext

  componentDidMount() {
    this.unregisterFun = this.context.registerField(this)
  }

  componentWillUnmount() {
    if (this.unregisterFun) {
      this.unregisterFun()
    }
  }

  onStoreChange = () => {
    this.forceUpdate()
  }

  getControlled = () => {
    const {setFieldValue, getFieldValue} = this.context
    console.log(this.context)
    const {name} = this.props
    return {
      value: getFieldValue(name),
      onChange: e => {
        const newValue = e.target.value
        setFieldValue(name, newValue)
      }
    }
  }

  render() {
    const {children, name} = this.props

    const {getFieldValue} = this.context
    const errMsgs = getFieldValue('errMsgs')
    let message
    if (errMsgs) {
      message = errMsgs[name]
    }

    const childrenNodes = React.cloneElement(children, this.getControlled())
    return (
      <div>
        {childrenNodes}
        <GetErrMessage message={message} />
      </div>
    )
  }
}
