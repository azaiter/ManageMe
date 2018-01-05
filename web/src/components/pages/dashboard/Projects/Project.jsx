import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar'
import {getLocalToken} from '../../../../actions/Auth'
import {clockIn, clockOut} from '../../../../utils/HttpHelper'

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'BlueFox',
      desc: 'Moving on-prem databases to Microsoft Azure.',
      due: 'December 2017',
      created: 'Feburary 2nd 2017',
      clockError: null,
      status: null,
      reqClockedInto: null,
      disabled: false
    }
    
  }


  clock(e){
    let tok = getLocalToken();
    if(this.state.disabled){
      this.setState({
        status: null,
        disabled: false,
        reqClockedInto: null
      })
      return;
    }
    this.setState({
      status: "You are clocked in for this requirement!",
      disabled: true,
      reqClockedInto: e.target.id
    })
    

  }



  render() {
    let i = 5;
    const requirements = ["Clean up legacy databases", "Notify Dev Teams about connection string change", "Move to Azure"];
    const listItems = requirements.map((requirement) =>
      <li><p>{requirement} - Time Clocked In: <b>{i++} Hours</b> - <a id={requirement} className="btn btn-primary btn-sm btn-outline btn-rounded" onClick={(e) => this.clock(e)} disabled={requirement != this.state.reqClockedInto && this.state.disabled}>Clock in/out</a>{this.state.clockError}</p></li>
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
