import React from 'react';
import Router, { Link, RouteHandler } from "react-router";
import {Panel, Input, Button} from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from "jquery";
import {createTeam} from "../../../../utils/HttpHelper"
import {getLocalToken} from "../../../../actions/Auth"

class CreateTeam extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      users: "",
      name_error_text: null,
      users_error_text: null,
      creationError: null,
      disabled: true,
    }
  }

  isDisabled() {
    let name_is_valid = false;
    let users_is_valid = false;

    if(this.state.name.length > 0){
      name_is_valid = true;
    }else{
      name_is_valid = false;
      this.setState({
        name_error: "Please enter a team name",
      })
    }

    if(this.state.users.length > 0){
      users_is_valid = true;
    }else{
      users_is_valid = false;
      this.setState({
        users_error_text: "Please enter a user",
      })
    }

    if (name_is_valid && users_is_valid) {
      this.setState({
        disabled: false,
      });
    }else{
      this.setState({
        disabled: true,
      });
    }

  }

  changeValue(e, type) {
    const value = e.target.value;
    const next_state = {};
    next_state[type] = value;
    this.setState(next_state, () => {
        this.isDisabled();
    });
  }

  _handleKeyPress(e) {
      if (e.key === 'Enter') {
          if (!this.state.disabled) {
              this.handleLogin(e);
          }
      }
  }

  handleTeamCreation(e){
    e.preventDefault();
    let token = getLocalToken();
    if(!(token)){
      return;
    }
    createTeam(token, this.state.name, this.state.desc)
    .then(res =>{
      let json = res[0];
       let status = res[1];
       if(status != 200){
          this.setState({
            creationError: "Team exists!"
          });
          return;
       }
       this.props.history.pushState(null, '/dashboard/overview');
    }).catch(err => {
        console.log("Error:",err);
    })
    
    return false;
  }



  render(){
    return(
        <div className="login-page ng-scope ui-view"> 
          <div className="row"> 
            <div className="col-md-5 col-lg-4 col-md-offset-4 col-lg-offset-4"> 
              {/*<img src={require("../../common/images/flat-avatar.png")} className="user-avatar" />*/}
              <h1>Manage Me - Create Team</h1> 
              <form role="form" onSubmit={this.handleTeamCreation.bind(this)} className="ng-pristine ng-valid"> 
                <div className="form-content"> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Team Name" errorText={this.state.name_error_text} onChange={(e) => this.changeValue(e, 'name')} /> 
                  </div>
                  <div className="form-group"> 
                    <textarea rows="4" className="form-control input-underline input-lg" placeholder="Users: Seperate emails with a comma" errorText={this.state.users_error_text} onChange={(e) => this.changeValue(e, 'desc')} /> 
                  </div>
                  <p style={{ color: "red" }}>{this.state.creationError}</p>
                </div>
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={this.props.history.goBack} >Back</button> 
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={(e) => this.handleTeamCreation(e)} disabled={this.state.disabled}>Submit</button>                  
              </form> 
            </div> 
          </div> 
        </div>
      
    );
  }
}

export default CreateTeam;