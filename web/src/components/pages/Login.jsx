import React from 'react';
import Router from 'react-router';
import {Panel, Input, Button} from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from "jQuery";
import * as Auth from '../../actions/Auth'

class LoginPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loginID: '',
      password: '',
      isSubmitted: false
    }
    Auth.login("dingdonglinglong","SuhDud@2123");
  }

  handleLogin(e){
    e.preventDefault();
    this.props.history.pushState(null, '/dashboard/overview');
    return false;
  }

  handleRegister(e){
    e.preventDefault();
    this.props.history.pushState(null, '/register');
    return false;
  }


  render(){
    return(
        <div className="login-page ng-scope ui-view"> 
          <div className="row"> 
            <div className="col-md-5 col-lg-4 col-md-offset-4 col-lg-offset-4"> 
              {/*<img src={require("../../common/images/flat-avatar.png")} className="user-avatar" />*/}
              <h1>Manage Me - Login</h1> 
              <form role="form" onSubmit={this.handleLogin.bind(this)} className="ng-pristine ng-valid"> 
                <div className="form-content"> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Username" /> 
                  </div> 
                  <div className="form-group"> 
                    <input type="password" className="form-control input-underline input-lg" placeholder="Password" /> 
                  </div> 
                </div>
                <button type="submit" className="btn btn-white btn-outline btn-lg btn-rounded btn-block">Login</button>
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={this.handleRegister.bind(this)} >Register</button>                  
              </form> 
            </div> 
          </div> 
        </div>
      
    );
    
  }

}

export default LoginPage;