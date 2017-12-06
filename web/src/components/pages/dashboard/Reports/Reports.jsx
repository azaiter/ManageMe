import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar'
import {getLocalToken} from '../../../../actions/Auth'
import {getTime} from '../../../../utils/HttpHelper'

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      times: null,
      timeReportingError: null
    }

    getTime(getLocalToken()).then(res => {
      let json = res[0];
      let status = res[1];
      console.log(json);
      this.setState({
        times: json.message
      })

    }).catch(err => {
      console.log("Error:",err);
    });
  }
  

  render() {
    return (

      <div key="reports" className="reports-page">
        <div className="ng-scope"> 
          <ToolBar></ToolBar>
          <h2>Reports:</h2> 
          <Jumbotron> 
            {this.state.times}
          </Jumbotron> 
        </div>
      </div>
      
    );
  }
}

export default Buttons;