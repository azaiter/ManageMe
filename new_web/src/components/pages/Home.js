/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';

import Dashboard from './Dashboard';
import Project from './Project';

class Home extends Component {
  componentWillMount() {

  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="Home">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only" />
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="#">ManageMe</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="active"><Link to="/Dashboard">Dashboard</Link></li>
                <li><Link to="/Projects">Projects</Link></li>
                <li><Link to="/Reports">Reprots</Link></li>
                <li><Link to="/Admin">Admin</Link></li>
              </ul>
              {// <ul className="nav navbar-nav navbar-right">
                  // <li><a href="../navbar/">Default</a></li>
                  // <li><a href="../navbar-static-top/">Static top</a></li>
                  // <li className="active"><a href="./"></a></li>
                // </ul>
                }
            </div>
          </div>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12">
              <Route exact path="/" component={Dashboard} />
              <Route path="/Project/:id" component={Project} />
            </div>
          </div>
        </div>
      </div>);
  }
}

export default Home;
