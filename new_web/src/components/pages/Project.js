import React, { Component } from 'react';
import {
  Col,
  Row,
  Card,
  CardTitle,
  CardBody,
} from 'reactstrap';

import ProjectComments from '../project/ProjectComments';
import ActiveRequirements from '../project/ActiveRequirements';
import ProjectDocuments from '../project/ProjectDocuments';
import CompletedRequirements from '../project/CompletedRequirements';
import NeedingAprovalRequirements from '../project/NeedingAprovalRequirements';

import { clockIn, clockOut, getRequirementsByProjectId, getProjects, deleteReq, createRequirement, updateRequirement } from '../../utils/HttpHelper';
import { getLocalToken } from '../../utils/Auth';

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: this.props.match.params.id,
      activeRequirements: [],
      completedRequirements: [],
      needingAprovalRequirements: [],
      loaded: false,
      created: '',
      desc: '',
      name: '',
    };
  }

  componentDidMount() {
    this.getRequirements();
    this.getProjectInformation();
  }

  getProjectInformation = () => {
    getProjects(getLocalToken()).then((res) => {
      const json = res[0];
      const status = res[1];
      if (status !== 200) {
        return;
      }
      const project = json.filter(i => parseInt(this.state.projectId) === i.uid)[0];
      this.setState({
        name: project.name,
        desc: project.desc,
        created: project.created,
      });
    });
  }

  getRequirements = () => {
    getRequirementsByProjectId(getLocalToken(), this.props.match.params.id).then((res) => {
      const json = res[0];
      const status = res[1];
      if (status !== 200) {
        return;
      }

      const activeRequirements = [];
      const completedRequirements = [];
      const needingAprovalRequirements = [];

      json.forEach((element) => {
        switch (element.status) {
          case 1:
            activeRequirements.push(element);
            break;
          case 2:
            completedRequirements.push(element);
            break;
          case 3:
            needingAprovalRequirements.push(element);
            break;
          case 4:

            break;
          default:

            break;
        }
      });

      this.setState({
        activeRequirements,
        completedRequirements,
        needingAprovalRequirements,
        loaded: true,
      });
    });
  }

  render() {
    return (
      <Row style={{ textAlign: 'left' }}>
        <Col xs="12" sm="12" md="12" lg="4" >
          <Card>
            <CardTitle className="bg-primary text-white">Project Information
            </CardTitle>
            <CardBody>
              <h3>{this.state.name}</h3>
              <hr />
              <span style={{ fontSize: '18px' }}>{this.state.desc}</span>
              <br />
              <br />
              Created: {this.state.created}
            </CardBody>
          </Card>
          <ProjectComments />
          <ProjectDocuments />
        </Col>
        <Col xs="12" sm="12" md="12" lg="8" >
          <NeedingAprovalRequirements oldRequirements={this.state.activeRequirements} newRequirements={this.state.needingAprovalRequirements} getRequirements={this.getRequirements} />
          <ActiveRequirements requirements={this.state.activeRequirements} projectID={this.props.match.params.id} getRequirements={this.getRequirements} />
          <CompletedRequirements requirements={this.state.completedRequirements} getRequirements={this.getRequirements} />
        </Col>
        <div />
      </Row>
    );
  }
}

export default Project;
