/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap'

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
          <Container fluid={true}>
            <Row>
              <Col xs="12">
                <Switch>
                  <Route path="/Login" component={Login} />
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
