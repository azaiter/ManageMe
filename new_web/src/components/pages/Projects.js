import React, { Component } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';

import RecentProjects from '../dashboard/RecentProjects';
import RecentRequirements from '../dashboard/RecentRequirements';
import ProjectList from '../projects/ProjectList';


class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Row>
        <Col lg="8">
          <ProjectList />
        </Col>
        <Col lg="4">
          <RecentProjects />
          <RecentRequirements />
        </Col>
      </Row>
    );
  }
}

export default Projects;
