import React from 'react';
import { withRouter } from 'react-router-dom';
import { login, getLocalToken } from '../../utils/Auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      user_error_text: null,
      password_error_text: null,
      disabled: true,
      loginError: '',


    };
    if (getLocalToken) {
      this.props.history.push('/Dashboard', null);
    }
  }

  isDisabled() {
    let userIsValid = false;
    let passwordIsValid = false;

    if (this.state.username === '') {
      userIsValid = false;
      this.setState({
        user_error_text: null,
      });
    } else if (this.state.user.length >= 3) {
      userIsValid = true;
      this.setState({
        user_error_text: null,
      });
    } else {
      userIsValid = false;
      this.setState({
        user_error_text: 'Sorry, this is not a valid user',
      });
    }

    if (this.state.password === '' || !this.state.password) {
      passwordIsValid = false;
      this.setState({
        password_error_text: null,
      });
    } else if (this.state.password.length >= 8) {
      passwordIsValid = true;
      this.setState({
        password_error_text: null,
      });
    } else {
      passwordIsValid = false;
      this.setState({
        password_error_text: 'Your password must be at least 8 characters',
      });
    }

    if (userIsValid && passwordIsValid) {
      this.setState({
        disabled: false,
      });
    } else {
      this.setState({
        disabled: true,
      });
    }
  }

  handleLogin(e) {
    e.preventDefault();
    login(this.state.user, this.state.password).then((status) => {
      if (status !== 200) {
        this.setState({
          loginError: 'Username or Password is incorrect',
        });
        return;
      }
      this.props.history.push('/Dashboard', null);
    });
    return false;
  }

  handleRegister(e) {
    e.preventDefault();
    this.props.history.push('/Register', null);
    return false;
  }

  changeValue(e, type) {
    const { value } = e.target;
    const nextState = {};
    nextState[type] = value;
    this.setState(nextState, () => {
      this.isDisabled();
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.handleLogin(e);
      }
    }
  }


  render() {
    return (
      <div className="login-page ng-scope ui-view" onKeyPress={e => this.handleKeyPress(e)}>
        <div className="row">
          <div className="col-md-5 col-lg-4 col-md-offset-4 col-lg-offset-4">
            {/* <img src={require("../../common/images/flat-avatar.png")} className="user-avatar" /> */}
            <h1>Manage Me - Login</h1>
            <form role="form" onSubmit={this.handleLogin.bind(this)} className="ng-pristine ng-valid">
              <div className="form-content">
                <div className="form-group">
                  <input type="text" className="form-control input-underline input-lg" placeholder="Username" errorText={this.state.user_error_text} onChange={e => this.changeValue(e, 'user')} />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control input-underline input-lg" placeholder="Password" errorText={this.state.password_error_text} onChange={e => this.changeValue(e, 'password')} />
                </div>
              </div>
              <p style={{ color: 'red' }}>{this.state.loginError}</p>
              <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={e => this.handleLogin(e)} disabled={this.state.disabled}>Login</button>
              <button className="btn btn-white btn-outline btn-lg btn-rounded btn-block" onClick={this.handleRegister.bind(this)} >Register</button>
            </form>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(Login);
