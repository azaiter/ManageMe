import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar'

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'BlueFox',
      desc: 'Moving on-prem databases to Microsoft Azure.',
      due: 'December 2017',
      created: 'Feburary 2nd 2017',
    }
    
  }


  render() {
    let i = 5;
    const requirements = ["Clean up legacy databases", "Notify Dev Teams about connection string change", "Move to Azure"];
    const listItems = requirements.map((requirement) =>
      <li><p>{requirement} - Time Clocked In: <b>{i++} Hours</b> - <a className="btn btn-primary btn-sm btn-outline btn-rounded">Clock in/out</a></p></li>
    );
    return (
      <div className="overview-page" key="overview"> 
        <ToolBar></ToolBar>
        <h2>Project:</h2> 
        <Jumbotron> 
          <h1>{this.state.name}</h1> 
          <hr />
          Description: {this.state.desc}<br />
          Due: {this.state.due} <br />
          Created: {this.state.created}
          <hr />
          <h3>Requirements:</h3> <br />
          <ul>
            {listItems}
          </ul>
        </Jumbotron> 
      </div>
      
      
    );
  }
}

export default Project;
