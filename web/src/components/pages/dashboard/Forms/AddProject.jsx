import React from 'react';
import Router, { Link, RouteHandler } from "react-router";
import {Panel, Input, Button} from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from "jquery";

class AddProject extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loginID: '',
      password: '',
      isSubmitted: false
    }
  }

  handleRegister(e){
    e.preventDefault();
    console.log(this.props.history);
    return false;
  }



  render(){
    return(
        <div className="login-page ng-scope ui-view"> 
          <div className="row"> 
            <div className="col-md-5 col-lg-4 col-md-offset-4 col-lg-offset-4"> 
              {/*<img src={require("../../common/images/flat-avatar.png")} className="user-avatar" />*/}
              <h1>Manage Me - Register</h1> 
              <form role="form" onSubmit={this.handleRegister.bind(this)} className="ng-pristine ng-valid"> 
                <div className="form-content"> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Project Name" /> 
                  </div>

                
                </div>
                <button type="submit" className="btn btn-white btn-outline btn-lg btn-rounded btn-block">Submit</button>                  
              </form> 
            </div> 
          </div> 
        </div>
      
    );
  }
}

export default AddProject;