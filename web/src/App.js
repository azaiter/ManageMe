/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Home from './components/pages/Home';
import Login from './components/pages/Login';

class App extends Component {
  componentWillMount() {

  }

  componentDidMount() {

  }

  render() {
    return (
      <Router>
        <div className="App">
          <link href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" rel="stylesheet" />
          <Container fluid>
            <Row>
              <Col xs="12">
                <Switch>
                  <Route exact path="/Login" component={Login} />
                  <Route path="/" component={Home} />
                </Switch>
              </Col>
            </Row>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
