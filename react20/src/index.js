import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from './s-react/s-react-dom'
import './index.css';

const jsx = (
  <div className="border">
    <h1>Index Page</h1>
    <a href="http://www.baidu.com">Baidu</a>
  </div>
)

ReactDOM.render(jsx, document.getElementById('root'))
