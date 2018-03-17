import React from 'react';
import { Link } from 'react-router-dom';
import CreateTeam from '../forms/CreateTeam';
import CreateProject from '../forms/CreateProject';
import { Modal, Button } from 'react-bootstrap';
import { createProject, getTeams } from '../../utils/HttpHelper';
import { getLocalToken } from '../../utils/Auth';

class ToolBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projShow: false,
      teamShow: false,
      teams: [],
    };
    this.getTeams();
  }

  getTeams() {
    getTeams(getLocalToken()).then((res) => {
      const json = res[0];
      const status = res[1];
      if (status != 200) {
        this.setState({
          creationError: 'No Teams!',
        });
        return;
      }
      this.setState({
        teams: json,
      });
    });
  }

  handleClose(form) {
    switch (form) {
      case 'team':
        this.setState({ teamShow: false });
        break;
      case 'proj':
        this.setState({ projShow: false });
        break;
      default:
        break;
    }
  }

  handleShow(form) {
    switch (form) {
      case 'team':
        this.setState({ teamShow: true });
        break;
      case 'proj':
        this.setState({ projShow: true });
        break;
      default:
        break;
    }
  }

  render() {
  	return (
    <div>
      <Link to="/Reports" className="pull-right btn btn-primary btn-outline btn-rounded">View Reports</Link>
      <button className="pull-right btn btn-primary btn-outline btn-rounded" onClick={this.handleShow.bind(this, 'team')}>Create Team</button>
      <button className="pull-right btn btn-primary btn-outline btn-rounded" onClick={this.handleShow.bind(this, 'proj')}>Create Project</button>
      <Modal show={this.state.teamShow} onHide={this.handleClose.bind(this, 'team')}>
        <Modal.Header closeButton>
          <Modal.Title>Create Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateTeam />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose.bind(this, 'team')}>Close</Button>
        </Modal.Footer>
      </Modal>


      <Modal show={this.state.projShow} onHide={this.handleClose.bind(this, 'proj')}>
        <Modal.Header closeButton>
          <Modal.Title>Create Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateProject data={this.state.teams} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose.bind(this, 'proj')}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>

    );
  }
}

export default ToolBar;
