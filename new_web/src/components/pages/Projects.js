import React, { Component } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';

import RecentProjects from '../dashboard/RecentProjects';
import RecentRequirements from '../dashboard/RecentRequirements';
import ProjectList from '../projects/ProjectList';
import ToolBar from '../projects/ToolBar';


class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <ToolBar />
          </Col>
        </Row>
        <Row>
          <Col lg="8">
            <ProjectList />
          </Col>
          <Col lg="4">
            <RecentProjects />
            <RecentRequirements />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Projects;
