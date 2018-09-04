import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Modal, Button } from 'react-bootstrap';
import { getLocalToken } from '../../utils/Auth';
import { getProjects, deleteProject, getProjectHours, getTeams, getTeamById, deleteTeam } from '../../utils/HttpHelper';
import UpdateProject from '../forms/UpdateProject';

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      projects: '',
      tok: getLocalToken(),
      uids: {},
      shows: {},
      teams: [],
    };
    this.getProjs();
  }

  async getHours(uid) {
    return getProjectHours(getLocalToken(), uid).then((res) => {
      const json = res[0];
      const code = res[1];
      if (code !== 200) {
        return;
      }
      const uids = this.state.uids;
      uids[uid] = (json[0]['SUM(soft_cap)'] / json[1]['SUM(soft_cap)']) * 100;
      this.setState({
        uids,
      });
    }).catch((e) => {
      console.log(e);
    });
  }

  getProjs() {
    getTeams(this.state.tok).then((res) => {
      const json = res[0];
      const code = res[1];
      if (code !== 200) {
        this.setState({
          error: json.message,
        });
        return;
      }
      const teams = json.reverse();
      this.setState({
        teams,
      });
    });

    getProjects(this.state.tok).then((res) => {
      const json = res[0];
      const code = res[1];
      if (code !== 200) {
        this.setState({
          error: json.message,
        });
        return;
      }
      const projects = json.reverse();
      projects.map((project) => {
        this.getHours(project.uid);
      });
      this.setState({
        projects,
      });
    });
  }

  deleteProj(projId) {
    deleteProject(this.state.tok, projId).then((res) => {
      const json = res[0];
      const code = res[1];
      if (code !== 200) {
        this.setState({
          error: json.message,
        });
        return;
      }
      const projects = this.state.projects.filter(e => e.uid !== projId);
      this.setState({
        projects,
      });
    });
  }

  deleteT(teamId) {
    deleteTeam(this.state.tok, teamId).then((res) => {
      const json = res[0];
      const code = res[1];
      if (code !== 200) {
        this.setState({
          error: json.message,
        });
        return;
      }
      getTeams(this.state.tok).then((resp) => {
        const teams = resp[0].reverse();
        const scode = resp[1];
        if (scode !== 200) {
          this.setState({
            error: json.message,
          });
          return;
        }
        this.setState({
          teams,
        });
      });
    });
  }

  handleClose(projId) {
    const shows = this.state.shows;
    shows[projId] = false;
    this.setState({ shows });
  }

  handleShow(projId) {
    const shows = this.state.shows;
    shows[projId] = true;
    this.setState({ show: shows });
  }

  render() {
    if (this.state.projects.length > 0) {
      const projects = this.state.projects.map((project) => {
        const url = `/Project/${project.uid}`;
        return (
          <div>
            <div className="btn-toolbar pull-right">
              <button className="btn btn-info" onClick={this.handleShow.bind(this, project.uid)}>Update Project</button>
              <Modal show={this.state.shows[project.uid]} onHide={this.handleClose.bind(this, project.uid)}>
                <Modal.Header closeButton>
                  <Modal.Title>Update Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <UpdateProject data={project} />
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.handleClose.bind(this, project.uid)}>Close</Button>
                </Modal.Footer>
              </Modal>
              <button className="btn btn-danger" onClick={this.deleteProj.bind(this, project.uid)}>Delete Project</button>
            </div>
            <Link to={url}><h1>{project.name}</h1> </Link>
                  Description: {project.desc}<br />
                  Created: {project.created}
            <br /> <br />
            <div className="progress">

              <div
                className="progress-bar progress-bar-primary"
                role="progressbar"
                aria-valuenow="40"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: `${this.state.uids[project.uid]}%` }}
              >
                {this.state.uids[project.uid]}% Complete (on track)
              </div>
            </div>
            <hr />

          </div>);
      });


      const teams = this.state.teams.map((team) => {
        if (team.name) {
          const url = `/Admin/Team/${team.uid}`;
          return (
            <div>
              <div className="btn-toolbar pull-right">

                <button className="btn btn-danger" onClick={this.deleteT.bind(this, team.uid)}>Delete Team</button>
              </div>
              <Link to={url}><h1>{team.name}</h1> </Link>
                    Description: {team.desc}<br />


            </div>);
        }
      });

      return (
        <div className="overview-page" key="overview">
          <Jumbotron>
            {projects}
          </Jumbotron>
          <h2>My Teams:</h2>
          <Jumbotron>
            {teams}
          </Jumbotron>
        </div>


      );
    }

    return (null);
  }
}

export default Overview;
