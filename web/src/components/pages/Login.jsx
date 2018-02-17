import React from 'react';
import Router from 'react-router';
import {Panel, Input, Button} from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from "jquery";
import {login, getLocalToken} from '../../actions/Auth'

class LoginPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      user_error_text: null,
      password_error_text: null,
      disabled: true,
      loginError: ''

      
  };
    if(getLocalToken){
        this.props.history.pushState(null, '/dashboard/overview');       
    }
  }

  isDisabled() {
    let user_is_valid = false;
    let password_is_valid = false;

    if (this.state.username === '') {
        user_is_valid = false;
        this.setState({
            user_error_text: null,
        });
    } else if (this.state.user.length >= 3) {
        user_is_valid = true;
        this.setState({
            user_error_text: null,
        });

    } else {
        user_is_valid = false;
        this.setState({
            user_error_text: 'Sorry, this is not a valid user',
        });
    }

    if (this.state.password === '' || !this.state.password) {
        password_is_valid = false;
        this.setState({
            password_error_text: null,
        });
    } else if (this.state.password.length >= 8) {
        password_is_valid = true;
        this.setState({
            password_error_text: null,
        });
    } else {
        password_is_valid = false;
        this.setState({
            password_error_text: 'Your password must be at least 8 characters',
        });

    }

    if (user_is_valid && password_is_valid) {
        this.setState({
            disabled: false,
        });
    }else{
        this.setState({
            disabled: true,
        })
    }

  }

  handleLogin(e){
    e.preventDefault();
    login(this.state.user, this.state.password).then(status => {
      if(status != 200){
        this.setState({
            loginError: "Username or Password is incorrect"
        })
        return;
      }
      this.props.history.pushState(null, '/dashboard/overview');
    });
    return false;
  }

  handleRegister(e){
    e.preventDefault();
    this.props.history.pushState(null, '/register');
    return false;
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

  


  render(){
    return(
        <div className="login-page ng-scope ui-view" onKeyPress={(e) => this._handleKeyPress(e)}> 
          <div className="row"> 
            <div className="col-md-5 col-lg-4 col-md-offset-4 col-lg-offset-4"> 
              {/*<img src={require("../../common/images/flat-avatar.png")} className="user-avatar" />*/}
              <h1>Manage Me - Login</h1> 
              <form role="form" onSubmit={this.handleLogin.bind(this)} className="ng-pristine ng-valid"> 
                <div className="form-content"> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Username" errorText={this.state.user_error_text} onChange={(e) => this.changeValue(e, 'user')} /> 
                  </div> 
                  <div className="form-group"> 
                    <input type="password" className="form-control input-underline input-lg" placeholder="Password" errorText={this.state.password_error_text} onChange={(e) => this.changeValue(e, 'password')} /> 
                  </div> 
                </div>
                <p style={{ color: "red" }}>{this.state.loginError}</p>
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={(e) => this.handleLogin(e)} disabled={this.state.disabled}>Login</button>
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={this.handleRegister.bind(this)} >Register</button>                  
              </form> 
            </div> 
          </div> 
        </div>
      
    );
    
  }

}

export default LoginPage;