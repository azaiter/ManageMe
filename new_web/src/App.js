/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';
import './App.css';

class App extends Component {
  componentWillMount() {

  }

  componentDidMount() {

  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header" />
          <Switch />
        </div>
      </Router>
    );
  }
}

export default App;
