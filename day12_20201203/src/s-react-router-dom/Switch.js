import React, {Component} from 'react';
import RouterContext from "./RouterContext";
import matchPath from "./matchPath";

class Switch extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const location = context.location
          let match
          let element

          React.Children.forEach(this.props.children, child => {
            if (!match) {
              element = child
              match = child.props.path ? matchPath(location.pathname, child.props) : context.match
            }
          })
          return match ? React.cloneElement(element, {}) : null
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Switch;
