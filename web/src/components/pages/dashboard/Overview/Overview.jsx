import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar';
import {getLocalToken} from '../../../../actions/Auth';
import {getProjects, deleteProject} from '../../../../utils/HttpHelper';

class Overview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      projects: "",
      tok: getLocalToken()
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
      console.log(json);
      this.setState({
        projects: json.reverse()
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

  render() {
    if(this.state.projects.length > 0){
      
      let projects = this.state.projects.map(project => {
        let p = (Math.floor(Math.random() * 100) + 1)
        let url = "/dashboard/project?id="+project.uid+"&name="+project.name+"&desc="+project.desc+"&created="+project.created;
        return (<div>
                  <div className="btn-toolbar pull-right">
                    <button className="btn btn-info">Update Project</button>
                    <button className="btn btn-danger" onClick={this.deleteProj.bind(this, project.uid)}>Delete Project</button>
                  </div> 
                <Link to={url}><h1>{project.name}</h1> </Link>
                  Description: {project.desc}<br />
                  Created: {project.created}
                  <br /> <br />
                  <div className="progress">
                  
                    <div className="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="40"
                    aria-valuemin="0" aria-valuemax="100" style={{width: p+"%"}}>
                      {p}% Complete (on track)
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
