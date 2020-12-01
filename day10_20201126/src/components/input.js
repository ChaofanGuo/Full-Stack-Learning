import React from 'react'

export default class Input extends React.Component {
  render() {
    const {value='', ...otherProps} = this.props
    return (
      <div style={{padding: 10}}>
        <input value={value} {...otherProps}/>
      </div>
    );
  }
}
