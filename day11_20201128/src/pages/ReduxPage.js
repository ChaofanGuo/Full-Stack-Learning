import React, {Component} from 'react';
import store from "../store";

const style = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '10px'
}

class ReduxPage extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  add = () => {
    store.dispatch({type: 'ADD', payload: 10})
  }

  asyAdd = () => {
    store.dispatch(() => {
      setTimeout(() => {
        store.dispatch({type: 'ADD'})
      }, 1000)
    })
  }

  render() {

    return (
      <div>
        <h3>Redux Page</h3>
        <div style={style}>{store.getState().count}</div>
        <button onClick={this.add}>ADD</button>
        <button onClick={this.asyAdd}>asyAdd</button>
      </div>
    );
  }
}

export default ReduxPage;
