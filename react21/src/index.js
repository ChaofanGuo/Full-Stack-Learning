// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from './s-react/s-react-dom'
import Component from './s-react/Component'
import './index.css';

/*
function FragmentComponent(props) {
  return (
    <>
      <li>Fragment</li>
      <li>Fragment</li>
    </>
  )
}
*/

function FunctionComponent(props) {
  return (
    <div className="border">
      <div>{props.name}</div>
    </div>
  )
}

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <div>{this.props.name}</div>
        <div>{this.props.name}</div>
        <div>{this.props.name}</div>
        <div>{this.props.name}</div>
        <div>{this.props.name}</div>
      </div>
    )
  }
}

const jsx = (
  <div className="border">
    <h1>Index Page</h1>
    <a href="http://www.baidu.com">Baidu</a>
    <FunctionComponent name="函数组件"/>
    <ClassComponent name="类组件"/>

    <>
      <li>Fragment</li>
      <li>Fragment1</li>
    </>
  </div>
)

ReactDOM.render(jsx, document.getElementById('root'))
