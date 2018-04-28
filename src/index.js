import React, { Component } from 'react';
import { render } from 'react-dom';
import LinearModel from './components/LinearModel';
import './style.css';

class App extends Component {
  render() {
    return (
      <LinearModel />
    );
  }
}

render(<App />, document.getElementById('root'));
