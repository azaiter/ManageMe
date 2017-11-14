import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';

class Blank extends React.Component {
  render() {
    return (
      <div className="overview-page" key="overview"> 
        <Link to="/dashboard/reports" className="pull-right btn btn-primary btn-outline btn-rounded">View Reports</Link> 
        <Link to="/addProject" className="pull-right btn btn-primary btn-outline btn-rounded">Add Project</Link> 
        <h2>My Projects:</h2> 
        <Jumbotron> 
          <h1>Project BlueFox</h1> 
          Description: Moving on-prem databases to Microsoft Azure.<br />
          Due: December 2017
          <br /><br /> 
          <a className="btn btn-primary btn-sm btn-outline btn-rounded">More</a>
          <hr />
          <h1>Project Trent</h1> 
          Description: Convert 1996 VB Project to Windows 10 C# App.<br />
          Due: January 2018
          <br /><br /> 
          <a className="btn btn-primary btn-sm btn-outline btn-rounded">More</a>
          <hr />
        </Jumbotron> 
      </div>
      
      
    );
  }
}

export default Blank;
