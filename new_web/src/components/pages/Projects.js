import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
} from 'reactstrap';
import { withRouter } from 'react-router-dom';

import RecentProjects from '../dashboard/RecentProjects';
import RecentRequirements from '../dashboard/RecentRequirements';
import MyProjects from '../projects/MyProjects';
import ToolBar from '../projects/ToolBar';
import PendingRequirements from '../projects/PendingRequirements';


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
          <Col lg="8">
            <Row>
              <Col>
                <PendingRequirements />
              </Col>
            </Row>
            <Row>
              <Col>
                <MyProjects />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button className="float-right btn-success" onClick={() => this.props.viewCreateProject()}>Create Project</Button>
              </Col>
            </Row>
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

export default withRouter(Projects);
