import React from 'react';
import Router, { Link, RouteHandler } from "react-router";
import {Panel, Input, Button} from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from "jquery";
import {createProject} from "../../../../utils/HttpHelper"
import {getLocalToken} from "../../../../actions/Auth"

class CreateProject extends React.Component{
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
      reqName: '',
      reqTime: '',
      requirements: [{ reqName: '', reqTime: 0 }],
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

  handleRequirementChange = (idx) => (evt) => {
    const newRequirements = this.state.requirements.map((requirement, sidx) => {
      if (idx !== sidx) return requirement;
      if(Number.isInteger(parseInt(evt.target.value)))
        return { ...requirement, reqTime: evt.target.value };
      else
        return { ...requirement, reqName: evt.target.value };
    });

    this.setState({ requirements: newRequirements });
  }

  handleAddRequirement = () => {
    this.setState({
      requirements: this.state.requirements.concat([{ reqName: '', reqTime: 0 }])
    });
  }

  handleRemoveRequirement = (idx) => () => {
    this.setState({
      requirements: this.state.requirements.filter((s, sidx) => idx !== sidx)
    });
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
    console.log(this.state.requirements);
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
       console.log("I AM WORKING")
       window.location.reload();
    }).catch(err => {
        console.log("Error:",err);
    })
    
    return false;
  }



  render(){
    return(
      <div>
              <form role="form" onSubmit={this.handleProjCreation.bind(this)} className="ng-pristine ng-valid"> 
                <div className="form-content"> 
                  <div className="form-group"> 
                    <input type="text" className="form-control" placeholder="Project Name" errorText={this.state.name_error_text} onChange={(e) => this.changeValue(e, 'name')} /> 
                  </div>
                  <div className="form-group"> 
                    <textarea rows="4" className="form-control" placeholder="Project Description" errorText={this.state.desc_error_text} onChange={(e) => this.changeValue(e, 'desc')} /> 
                  </div>
                  {this.state.requirements.map((requirement, idx) => (
                    <div className="requirement form-inline">
                      <input
                        type="text"
                        placeholder={`Requirement #${idx + 1} name`}
                        value={requirement.name}
                        onChange={this.handleRequirementChange(idx)}
                        className="form-control"
                      />
                      {'\u00A0'}
                      <input
                        type="number"
                        placeholder={`Time`}
                        value={requirement.time}
                        onChange={this.handleRequirementChange(idx)}
                        className="form-control"
                      />{'\u00A0'}
                      <button type="button" onClick={this.handleRemoveRequirement(idx)} className="btn btn-danger btn-small">-</button>
                    </div>
                  ))}
                  <button type="button" onClick={this.handleAddRequirement} className="btn btn-warning btn-small">+</button>
                  <p style={{ color: "red" }}>{this.state.creationError}</p>
                </div>
                <button className="btn btn-success" onClick={(e) => this.handleProjCreation(e)} disabled={this.state.disabled}>Submit</button>                  
              </form> 
            </div> 
      
    );
  }
}

export default CreateProject;