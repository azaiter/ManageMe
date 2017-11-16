import React from 'react';
import Router, { Link, RouteHandler } from "react-router";
import {Panel, Input, Button} from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from "jQuery";
import {register} from '../../actions/Auth'

class RegisterPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loginID: '',
      password: '',
      isSubmitted: false
    }
    
    register("Bradley", "Chippi", "asdfasdf@svsfdsafu.com", "9999999999", "1446 Trent Rd.", "dingdonglinglong", "SuhDud@2123");
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
                    <input type="text" className="form-control input-underline input-lg" placeholder="First Name" /> 
                  </div>
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Last Name" /> 
                  </div>
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Username" /> 
                  </div> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Email" /> 
                  </div> 
                  <div className="form-group"> 
                    <input type="password" className="form-control input-underline input-lg" placeholder="Password" /> 
                  </div> 
                  <div className="form-group"> 
                    <input type="password" className="form-control input-underline input-lg" placeholder="Comfirm Password" /> 
                  </div> 
                </div>
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={this.props.history.goBack} >Back</button> 
                <button type="submit" className="btn btn-white btn-outline btn-lg btn-rounded btn-block">Register</button>                  
              </form> 
            </div> 
          </div> 
        </div>
      
    );
  }
}

export default RegisterPage;