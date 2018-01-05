import React from 'react';
import Router, { Link, RouteHandler } from "react-router";
import {Panel, Input, Button} from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from "jquery";
import {register} from '../../actions/Auth'
import {validateEmail, validatePhoneNumber, validatePassword} from '../../utils/misc'

class RegisterPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      first: '',
      last: '',
      phoneNum: '',
      address: '',
      passwordConfirm: '',
      first_error_text: null,
      last_error_text: null,
      user_error_text: null,
      password_error_text: null,
      passwordConfirm_error_text: null,
      email_error_text: null,
      phoneNum_error_text: null,
      address_error_text: null,
      disabled: true,
      registerError: null
    }
    
  }

  isDisabled() {
    let user_is_valid = false;
    let password_is_valid = false;
    let email_is_valid = false;
    let address_is_valid = false;
    let first_is_valid = false;
    let last_is_valid = false;
    let phoneNum_is_valid = false;

    if(this.state.first.length > 0){
      first_is_valid = true;
    }else{
      first_is_valid = false;
      this.setState({
        first_error_text: "Please enter a first name",
      })
    }

    if(this.state.last.length > 0){
      last_is_valid = true;
    }else{
      last_is_valid = false;
      this.setState({
        last_error_text: "Please enter a last name",
      })
    }

    if(this.state.address.length > 0){
      address_is_valid = true;
    }else{
      address_is_valid = false;
      this.setState({
        address_error_text: "Please enter a address",
      })
    }

    if(validatePhoneNumber(this.state.phoneNum) || this.state.phoneNum.length === 0){
      phoneNum_is_valid = true;
    }else{
      phoneNum_is_valid = false;
      this.setState({
        phoneNum_error_text: "Please enter a valid phone number",
      })
    }

    if (this.state.username === '') {
      user_is_valid = false;
        this.setState({
            user_error_text: null,
        });
    } else if (this.state.username.length >= 3) {
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
    } else if (!(validatePassword(this.state.password))) {
      password_is_valid = false;
        this.setState({
          password_error_text: "Your password must be at least 8 characters, at least 1 lowercase, at least 1 uppercase, and at least 1 number."
        });
    } else if(this.state.password != this.state.passwordConfirm){
        password_is_valid = false;
        this.setState({
          password_errorConfirm_text: "Passwords do not match",
        })
    } else {
        password_is_valid = true;
    }

    if (this.state.email === '') {
      email_is_valid = false;
      this.setState({
         email_error_text: null,
      });
    } else if (validateEmail(this.state.email)) {
        email_is_valid = true;
        this.setState({
            email_error_text: null,
        });

    } else {
        email_is_valid = false;
        this.setState({
            email_error_text: 'Sorry, this is not a valid email',
        });
    }



    if (user_is_valid && password_is_valid && email_is_valid && phoneNum_is_valid && address_is_valid && first_is_valid && last_is_valid) {
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

  handleRegister(e){
    e.preventDefault();
    register(this.state.first, this.state.last, this.state.email, this.state.phoneNum, this.state.address, this.state.username, this.state.password)
      .then(res => {
        let json = res[0];
        let status = res[1]
        if(status != 200){
          this.setState({
            registerError: Object.values(json.message)
          }) 
          return;
        }
        this.props.history.goBack();
      });
      return false;
  }



  render(){
    return(
        <div className="login-page ng-scope ui-view" onKeyPress={(e) => this._handleKeyPress(e)}> 
          <div className="row"> 
            <div className="col-md-5 col-lg-4 col-md-offset-4 col-lg-offset-4"> 
              {/*<img src={require("../../common/images/flat-avatar.png")} className="user-avatar" />*/}
              <h1>Manage Me - Register</h1> 
              <form role="form" onSubmit={this.handleRegister.bind(this)} className="ng-pristine ng-valid"> 
                <div className="form-content"> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="First Name" placeholder="First Name" errorText={this.state.first_error_text} onChange={(e) => this.changeValue(e, 'first')}  /> 
                  </div>
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Last Name" placeholder="Last Name" errorText={this.state.last_error_text} onChange={(e) => this.changeValue(e, 'last')} /> 
                  </div>
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Username" placeholder="Username" errorText={this.state.user_error_text} onChange={(e) => this.changeValue(e, 'username')}  /> 
                  </div> 
                  <div className="form-group"> 
                    <input type="email" className="form-control input-underline input-lg" placeholder="Email" placeholder="Email" errorText={this.state.email_error_text} onChange={(e) => this.changeValue(e, 'email')}  /> 
                  </div> 
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Phone Number" placeholder="Phone Number" errorText={this.state.phoneNum_error_text} onChange={(e) => this.changeValue(e, 'phoneNum')} /> 
                  </div>
                  <div className="form-group"> 
                    <input type="text" className="form-control input-underline input-lg" placeholder="Address" placeholder="Address" errorText={this.state.address_error_text} onChange={(e) => this.changeValue(e, 'address')} /> 
                  </div>
                  <div className="form-group"> 
                    <input type="password" className="form-control input-underline input-lg" placeholder="Password (at least 1 lower, 1 upper, 1 special character, and 1 digit)" errorText={this.state.password_error_text} onChange={(e) => this.changeValue(e, 'password')} /> 
                  </div> 
                  <div className="form-group"> 
                    <input type="password" className="form-control input-underline input-lg" placeholder="Confirm Password" errorText={this.state.passwordConfirm_error_text} onChange={(e) => this.changeValue(e, 'passwordConfirm')} /> 
                  </div> 
                </div>
                <p style={{ color: "red" }}>{this.state.registerError}</p>
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={this.props.history.goBack} >Back</button> 
                <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={(e) => this.handleRegister(e)} disabled={this.state.disabled}>Register</button>                  
              </form> 
            </div> 
          </div> 
        </div>
      
    );
  }
}

export default RegisterPage;