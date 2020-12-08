// 哈密瓜

import React, {Component} from 'react';
import RouterContext from "./RouterContext";

export default function Prompt({message, when = true}) {
  return (
    <RouterContext.Consumer>
      {context => {
        if (!when) {
          return null
        }

        let method = context.history.block
        let unblock

        return (
          <LifeCycle
            onMount={self => {
              unblock = method(message(context.location))
            }}
            onUnmount={self => {
              unblock()
            }}
          />
        )
      }}
    </RouterContext.Consumer>
  )
}

class LifeCycle extends Component {
  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount.call(this, this)
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount.call(this, this)
    }
  }


  render() {
    return null
  }
}
