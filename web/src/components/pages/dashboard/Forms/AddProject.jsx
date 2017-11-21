import React from 'react';
import Router, { Link, RouteHandler } from "react-router";
import {Panel, Input, Button} from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from "jquery";
import {createProject} from "../../../../utils/HttpHelper"
import {getLocalToken} from "../../../../actions/Auth"

class AddProject extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      user: '',
      name_error_text: null,
      desc_error_text: null,
      creationError: null,
      disabled: true,
    }
  }

  isDisabled() {
    let name_is_valid = false;
    let desc_is_valid = false;

    if(this.state.name.length > 0){
      name_is_valid = true;
    }else{
      name_is_valid = false;
      this.setState({
        name_error_text: "Please enter a project name",
      })
    }

    if(this.state.desc.length > 0){
      desc_is_valid = true;
    }else{
      desc_is_valid = false;
      this.setState({
        desc_error_text: "Please enter a project description",
      })
    }

    if (name_is_valid && desc_is_valid) {
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

  handleProjCreation(e){
    e.preventDefault();
    let token = getLocalToken();
    if(!(token)){
      return;
    }
    createProject(token, this.state.name, this.state.desc)
    .then(res =>{
      let json = res[0];
       let status = res[1];
       if(status != 200){
          this.setState({
            creationError: "Project exists!"
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
              <h1>Manage Me - Create Project</h1> 
              <form role="form" onSubmit={this.handleProjCreation.bind(this)} className="ng-pristine ng-valid"> 
                <div className="form-content"> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Project Name" errorText={this.state.name_error_text} onChange={(e) => this.changeValue(e, 'name')} /> 
                  </div>
                  <div className="form-group"> 
                    <textarea rows="4" className="form-control input-underline input-lg" placeholder="Project Description" errorText={this.state.desc_error_text} onChange={(e) => this.changeValue(e, 'desc')} /> 
                  </div>
                  <p style={{ color: "red" }}>{this.state.creationError}</p>
                </div>
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={this.props.history.goBack} >Back</button> 
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={(e) => this.handleProjCreation(e)} disabled={this.state.disabled}>Submit</button>                  
              </form> 
            </div> 
          </div> 
        </div>
      
    );
  }
}

export default AddProject;