/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
} from 'reactstrap';

class HeaderCards extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Row>
        <Col lg="3" md="6">
          <Card className="top-card" outline color="primary">
            <CardTitle className="bg-primary text-white card-just-header">
              <Row>
                <Col xs="3">
                  <i className="fa fa-clock fa-4x" />
                </Col>
                <Col xs="9" className="text-right">
                  <div className="huge">26</div>
                  <div>Hours Worked</div>
                </Col>
              </Row>
            </CardTitle>
            <CardText>
              <Link to="/History/Hours" className="text-primary">
                <span className="float-left">View Details</span>
                <span className="float-right"><i className="fa fa-arrow-circle-right" /></span>
              </Link>
            </CardText>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card color="secondary" outline className="top-card">
            <CardTitle className="bg-secondary text-white card-just-header">
              <Row>
                <Col xs="3">
                  <i className="fa fa-check-circle fa-4x" />
                </Col>
                <Col xs="9" className="text-right">
                  <div className="huge">26</div>
                  <div>Requirements Worked On</div>
                </Col>
              </Row>
            </CardTitle>
            <CardText>
              <Link to="/History/Requirements/WorkedOn" className="text-secondary">
                <span className="float-left">View Details</span>
                <span className="float-right"><i className="fa fa-arrow-circle-right" /></span>
              </Link>
            </CardText>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card color="success" outline className="top-card">
            <CardTitle className="bg-success text-white card-just-header">
              <Row>
                <Col xs="3">
                  <i className="fa fa-check fa-4x" />
                </Col>
                <Col xs="9" className="text-right">
                  <div className="huge">26</div>
                  <div>Requirements Competed</div>
                </Col>
              </Row>
            </CardTitle>
            <CardText>
              <Link to="/History/Requirements/Completed" className="text-success">
                <span className="float-left">View Details</span>
                <span className="float-right"><i className="fa fa-arrow-circle-right" /></span>
              </Link>
            </CardText>
          </Card>
        </Col>
        <Col lg="3" md="6">
          <Card color="info" outline className="top-card">
            <CardTitle className="bg-info text-white card-just-header">
              <Row>
                <Col xs="3">
                  <i className="fab fa-product-hunt fa-4x" />
                </Col>
                <Col xs="9" className="text-right">
                  <div className="huge">5</div>
                  <div>Projects Worked On</div>
                </Col>
              </Row>
            </CardTitle>
            <CardText>
              <Link to="/History/Projects" className="text-info">
                <span className="float-left">View Details</span>
                <span className="float-right"><i className="fa fa-arrow-circle-right" /></span>
              </Link>
            </CardText>
          </Card>
        </Col>
      </Row>);
  }
}

export default HeaderCards;
