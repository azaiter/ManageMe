import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron, Modal, Button} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar';
import {getLocalToken} from '../../../../actions/Auth';
import {getProjects, deleteProject, getProjectHours} from '../../../../utils/HttpHelper';
import UpdateProject from '../Forms/UpdateProject';

class Overview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      projects: "",
      tok: getLocalToken(),
      uids: {},
      shows: {},
    }
    this.getProjs();
  }

  getProjs(){
    getProjects(this.state.tok).then(res => {
      let json = res[0];
      let code = res[1];
      if(code !== 200){
        this.setState({
          error: json.message
        });
        return;
      }
      let projects = json.reverse();
      projects.map(project => {
        this.getHours(project.uid);
      });
      this.setState({
        projects: projects,
      })
    });
  }

  deleteProj(projId){

    deleteProject(this.state.tok, projId).then(res => {
      let json = res[0];
      let code = res[1];
      if(code !== 200){
        this.setState({
          error: json.message
        });
        return;
      }
      let projects = this.state.projects.filter(e => {
        return e.uid !== projId;
      });
      this.setState({
        projects: projects
      })

    })
  }

 async getHours(uid){
  return getProjectHours(getLocalToken(), uid).then((res) => {
    let json = res[0];
    let code = res[1];
    if(code !== 200){
      return;
    }
    let uids = this.state.uids;
    uids[uid] = (json[0]['SUM(soft_cap)'] / json[1]['SUM(soft_cap)'])*100
    this.setState({
      uids: uids,
    })
    
  }).catch(e => {
   console.log(e); 
  });
}

handleClose(projId) {
  let shows = this.state.shows;
  shows[projId] = false;
  this.setState({ shows: shows }); 
  
}

handleShow(projId) {
  let shows = this.state.shows;
  shows[projId] = true;
  this.setState({ show: shows }); 
}

  render() {
    if(this.state.projects.length > 0){
      let projects = this.state.projects.map(project => {
        let url = "/dashboard/project?id="+project.uid+"&name="+project.name+"&desc="+project.desc+"&created="+project.created;
        return (<div>
                  <div className="btn-toolbar pull-right">
                    <button className="btn btn-info" onClick={this.handleShow.bind(this, project.uid)}>Update Project</button>
                    <Modal show={this.state.shows[project.uid]} onHide={this.handleClose.bind(this, project.uid)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Update Team</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <UpdateProject data={project}></UpdateProject>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={this.handleClose.bind(this,project.uid)}>Close</Button>
                      </Modal.Footer>
                    </Modal>
                    <button className="btn btn-danger" onClick={this.deleteProj.bind(this, project.uid)}>Delete Project</button>
                  </div> 
                <Link to={url}><h1>{project.name}</h1> </Link>
                  Description: {project.desc}<br />
                  Created: {project.created}
                  <br /> <br />
                  <div className="progress">
                  
                    <div className="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="40"
                    aria-valuemin="0" aria-valuemax="100" style={{width: this.state.uids[project.uid]+"%"}}>
                      {this.state.uids[project.uid]}% Complete (on track)
                    </div>
                  </div>
                  <hr />
          
          </div>);
      });
    

    return (
      <div className="overview-page" key="overview"> 
        
        <ToolBar></ToolBar>
        <h2>My Projects:</h2> 
        <Jumbotron>
          {projects}
        </Jumbotron> 
      </div>
      
      
    );
    }
    return (<div className="overview-page" key="overview"> 
        
    <ToolBar></ToolBar>
    <h2>My Projects:</h2> 
    <Jumbotron>
      No Projects Found
    </Jumbotron> 
  </div>)
    
  }
}

export default Overview;
