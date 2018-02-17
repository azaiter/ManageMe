import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar'

class Blank extends React.Component {

  render() {
    return (
      <div className="overview-page" key="overview"> 
        <ToolBar></ToolBar>
        <h2>My Projects:</h2> 
        <Jumbotron>
        <div className="btn-toolbar pull-right">
            <button className="btn btn-info">Update Project</button>
            <button className="btn btn-danger">Delete Project</button>
          </div> 
        <Link to="/dashboard/project"><h1>Project BlueFox</h1> </Link>
          Description: Moving on-prem databases to Microsoft Azure.<br />
          Due: December 2017
          <br /> <br />
          <div className="progress">
            <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40"
            aria-valuemin="0" aria-valuemax="100" style={{width: "90%"}}>
              90% Complete (on track)
            </div>
          </div>
          <hr />
          <div className="btn-toolbar pull-right">
            <button className="btn btn-info">Update Project</button>
            <button className="btn btn-danger">Delete Project</button>
          </div>
          <Link to="/dashboard/project"><h1>Project RedTiger</h1> </Link>
          Description: Convert 1996 VB Project to Windows 10 C# App.<br />
          Due: January 2018
          <br /> <br />
          <div className="progress">
            <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="40"
            aria-valuemin="0" aria-valuemax="100" style={{width: "20%"}}>
              20% Complete (off track)
            </div>
          </div>
          <hr />
          
        </Jumbotron> 
      </div>
      
      
    );
  }
}

export default Blank;
