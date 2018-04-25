import React, { Component } from 'react';
import {
  Col,
  Row,
  Card,
  CardTitle,
  CardBody,
  Button,
} from 'reactstrap';

import ProjectComments from '../project/ProjectComments';
import ActiveRequirements from '../project/ActiveRequirements';
import ProjectDocuments from '../project/ProjectDocuments';
import CompletedRequirements from '../project/CompletedRequirements';
import NeedingAprovalRequirements from '../project/NeedingAprovalRequirements';

import { getRequirementsByProjectId, deleteProject, getProjectInfo } from '../../utils/HttpHelper';
import { getLocalToken, checkPermissions } from '../../utils/Auth';

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
      canDelete: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([getProjectInfo(getLocalToken(), this.props.match.params.id),
      getRequirementsByProjectId(getLocalToken(), this.props.match.params.id),
      checkPermissions(4)]).then((res) => {
      this.getProjectInformation(res[0]);
      this.getRequirements(res[1]);
      this.setState({ canDelete: res[2] });
    });
  }

  getProjectInformation = (res) => {
    const json = res[0][0];
    const status = res[1];
    if (status !== 200) {
      this.setState({
        loaded: true,
      });
      return;
    }
    if (json === undefined) {
      this.props.history.push('/Projects', null);
      return;
    }
    this.setState({
      name: json.name,
      desc: json.desc,
      created: json.created,
      loaded: true,
    });
  }

  getRequirements = (res) => {
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
  }


  deleteProj = (projId) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      deleteProject(getLocalToken(), projId).then((res) => {
        const json = res[0];
        const code = res[1];
        if (code !== 200) {
          this.setState({
            error: json.message,
          });
          return;
        }
        this.props.history.push('/Projects', null);
      });
    } else {
      // Do nothing!
    }
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
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
            <ProjectComments projectID={this.state.projectId} />
          {
              // <ProjectDocuments />
              }
                <Button hidden={!this.state.canDelete} onClick={() => this.deleteProj(this.state.projectId)} color="danger">Delete Project</Button>
        </Col>
          <Col xs="12" sm="12" md="12" lg="8" >
            <NeedingAprovalRequirements oldRequirements={this.state.activeRequirements} newRequirements={this.state.needingAprovalRequirements} getRequirements={this.getData} />
              <ActiveRequirements requirements={this.state.activeRequirements} projectID={this.props.match.params.id} getRequirements={this.getData} />
                <CompletedRequirements requirements={this.state.completedRequirements} getRequirements={this.getData} />
          </Col>
            <div />
      </Row>
    );
  }
}

export default Project;
