import React, { Component } from 'react';
import {
  Col,
  Row,
  Card,
  CardTitle,
  CardBody,
} from 'reactstrap';
import ProjectComments from '../Project/ProjectComments';

import ActiveRequirements from '../Project/ActiveRequirements';
import ProjectDocuments from '../Project/ProjectDocuments';
import CompletedRequirements from '../Project/CompletedRequirements';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Row style={{ textAlign: 'left' }}>
        <Col xs="12" sm="12" md="12" lg="4" >
          <Card>
            <CardTitle className="bg-primary text-white">Project Information
            </CardTitle>
            <CardBody>
              <h2>Project:</h2>
              <h1>{this.state.name}</h1>
              <hr />
              Description: {this.state.desc}<br />
              Created: {this.state.created}
            </CardBody>
          </Card>
          <ProjectComments />
          <ProjectDocuments />
        </Col>
        <Col xs="12" sm="12" md="12" lg="8" >
          <ActiveRequirements projectID={this.props.match.params.id} />
          <CompletedRequirements projectID={this.props.match.params.id} />
        </Col>
        <div />
      </Row>
    );
  }
}

export default Project;
