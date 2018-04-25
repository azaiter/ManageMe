import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { withRouter } from 'react-router-dom';

import { BarLoader } from 'react-spinners';

import RecentProjects from '../dashboard/RecentProjects';
import RecentRequirements from '../dashboard/RecentRequirements';
import MyProjects from '../projects/MyProjects';
import ToolBar from '../projects/ToolBar';
import PendingRequirements from '../projects/PendingRequirements';
import CreateProject from '../forms/CreateProject';

import { getTeams, getProjects } from '../../utils/HttpHelper';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      modalLoading: false,
      teams: [],
      projects: [],
    };
  }

  componentDidMount() {
    getTeams(localStorage.getItem('token')).then((res) => {
      const data = res[0];
      const result = res[1];
      if (result == 200) {
        this.setState({
          teams: data,
        });
      }
    });
    this.getProjs();
  }

  getProjs = () => {
    getProjects(localStorage.getItem('token')).then((res) => {
      const json = res[0];
      const code = res[1];
      if (code !== 200) {
        this.setState({
          error: json.message,
        });
        return;
      }
      const projects = json.reverse();
      projects.forEach((element) => {
        element.actions = <div><Button className="btn-success" onClick={() => this.viewProject(element.uid)} >View</Button></div>;
      });
      this.setState({
        projects,
      });
    });
  }

  viewProject = (projectId) => {
    this.props.history.push(`/Project/${projectId}`, null);
  }

  toggleModal = () => {
    if (!this.state.modalLoading) {
      this.setState({
        modalIsOpen: !this.state.modalIsOpen,
        modalLoading: false,
      });
    }
    this.getProjs();
  }

  updateModalLoading = (loading) => {
    this.setState({
      modalLoading: loading,
    });
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
                  <MyProjects projects={this.state.projects} />
                </Col>
              </Row>
                <Row>
                  <Col>
                    <Button className="float-right btn-success" onClick={() => this.toggleModal()}>Create Project</Button>
                  </Col>
                </Row>
          </Col>
            <Col lg="4">
              <RecentProjects />
                <RecentRequirements />
            </Col>
        </Row>

          <Modal backdrop="static" keyboard={false} isOpen={this.state.modalIsOpen} toggle={this.toggleModal} centered size={this.state.modalSize}>
            <div className="modal-loading-bar">
              <BarLoader width="100%" loading={this.state.modalLoading} height={5} color="#6D6D6D" />
            </div>
              <ModalHeader toggle={this.toggleModal}>Create A Project
              </ModalHeader>
                <ModalBody>
                  <CreateProject toggleModal={this.toggleModal} updateModalLoading={this.updateModalLoading} teams={this.state.teams} getProjects={this.getProjs} />
                </ModalBody>
          </Modal>
      </div>
    );
  }
}

export default withRouter(Projects);
