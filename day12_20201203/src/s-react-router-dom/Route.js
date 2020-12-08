import React, {Component} from 'react';
import RouterContext from "./RouterContext";
import matchPath from "./matchPath";

class Route extends Component {
  render() {
    return <RouterContext.Consumer>
      {context => {
        const location = context.location
        const {children, component, render, path} = this.props
        // const match = location.pathname === path
        const match = path ? matchPath(location.pathname, this.props) : context.match
        // return match ? React.createElement(component) : null;
        const props = {
          ...context,
          location,
          match
        }

        return (
          <RouterContext.Provider value={props}>
            {match
              ? children
                ? typeof children === "function"
                  ? children(props)
                  : children
                : component
                  ? React.createElement(component, props)
                  : render
                    ? render(props)
                    : null
              : typeof children === "function"
                ? children(props)
                : null
            }
          </RouterContext.Provider>
        )
      }}
    </RouterContext.Consumer>
  }
}

export default Route;
