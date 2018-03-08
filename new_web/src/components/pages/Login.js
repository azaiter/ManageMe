import React from 'react';
import { Card, Row, Col, Input, Button, CardHeader, CardBody, InputGroup, InputGroupAddon, Alert } from 'reactstrap';
import { BarLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';
import 'font-awesome/css/font-awesome.min.css';
import { login, userIsLoggedIn, register } from '../../utils/Auth';
import { validateEmail, validatePhoneNumber, validatePassword } from '../../utils/RejexHelper';
import StockVideo from '../../media/stock.mp4';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
      loginHasError: false,
      userHasSignedUp: false,
      firstNameValid: true,
      lastNameValid: true,
      usernameValid: true,
      emailValid: true,
      phoneNumberValid: true,
      addressValid: true,
      passwordValid: true,
      verifyPasswordValid: true,
      registerUsernameError: '',
      registerFirstName: '',
      registerLastName: '',
      registerUsername: '',
      registerEmail: '',
      registerPhoneNumber: '',
      registerAddress: '',
      registerPassword: '',
      registerVerifyPassword: '',
      frontLoading: false,
      backLoading: false,
      username: '',
      password: '',
    };

    userIsLoggedIn().then((res) => {
      if (res) {
        this.props.history.push('/', null);
      }
    });
  }

  dismissLoginError = () => {
    this.setState({ loginHasError: false });
  }

  dismissUserSignedUp = () => {
    this.setState({ userHasSignedUp: false });
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ isFlipped: !this.state.isFlipped });
  }

  validateRegisterInputs = () => {
    let usernameMsg = '';
    if (this.state.registerUsername.length === 0) {
      usernameMsg = 'Please enter a valid username.';
    }

    this.setState({
      firstNameValid: (this.state.registerFirstName.length > 0),
      lastNameValid: (this.state.registerLastName.length > 0),
      usernameValid: (this.state.registerUsername.length > 0),
      emailValid: validateEmail(this.state.registerEmail),
      phoneNumberValid: validatePhoneNumber(this.state.registerPhoneNumber),
      addressValid: (this.state.registerAddress.length > 0),
      passwordValid: validatePassword(this.state.registerPassword),
      verifyPasswordValid: (this.state.registerPassword === this.state.registerVerifyPassword),
      registerUsernameError: usernameMsg,
    });

    return (
      (this.state.registerFirstName.length > 0) &&
      (this.state.registerLastName.length > 0) &&
      (this.state.registerUsername.length > 0) &&
      validateEmail(this.state.registerEmail) &&
      validatePhoneNumber(this.state.registerPhoneNumber) &&
      (this.state.registerAddress.length > 0) &&
      validatePassword(this.state.registerPassword) &&
      (this.state.registerPassword === this.state.registerVerifyPassword));
  }

  registerUser = () => {
    if (this.validateRegisterInputs()) {
      this.setState({
        backLoading: true,
      });

      register(
        this.state.registerFirstName,
        this.state.registerLastName,
        this.state.registerEmail,
        this.state.registerPhoneNumber,
        this.state.registerAddress,
        this.state.registerUsername,
        this.state.registerPassword,
      ).then((res) => {
        const json = res[0];
        const status = res[1];
        if (status === 200) {
          this.setState({
            isFlipped: false,
            loginHasError: false,
            userHasSignedUp: true,
            firstNameValid: true,
            lastNameValid: true,
            usernameValid: true,
            emailValid: true,
            phoneNumberValid: true,
            addressValid: true,
            passwordValid: true,
            verifyPasswordValid: true,
            registerUsernameError: '',
            registerFirstName: '',
            registerLastName: '',
            registerUsername: '',
            registerEmail: '',
            registerPhoneNumber: '',
            registerAddress: '',
            registerPassword: '',
            registerVerifyPassword: '',
          });
        } else if (status === 400) {
          if (!json.username) {
            this.setState({
              usernameValid: false,
              registerUsernameError: 'Username already exists.',
            });
          }
        }

        this.setState({
          backLoading: false,
        });
      });
    }
  }

  tryLogin = () => {
    this.setState({
      frontLoading: true,
    });

    login(this.state.username, this.state.password).then((status) => {
      if (status !== 200) {
        this.setState({
          loginHasError: true,
        });

        this.setState({
          frontLoading: false,
        });
      } else {
        this.props.history.push('/', null);
      }
    });
  }

  render() {
    return (
      <div id="loginCard">
        {/* TRENT, IGNORE THE RED SQUIGGLE BELOW */}
        <video id="background-video" loop autoPlay>
          <source src={StockVideo} type="video/mp4" />
          <source src={StockVideo} type="video/ogg" />
        </video>
        <Row>
          <Col>
            <h1 className="white-text">ManageMe</h1>
          </Col>
        </Row>
        <ReactCardFlip isFlipped={this.state.isFlipped}>
          <Card key="front">
            <CardHeader className="bg-primary text-white">Login
              <div id="loginPageFrontLoader" className="loginLoader">
                <BarLoader loading={this.state.frontLoading} width={348} height={5} color="#6D6D6D" />
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-user" /></span>
                    </InputGroupAddon>
                    <Input placeholder="Username" disabled={this.state.frontLoading} value={this.state.username} onChange={(e) => { this.setState({ username: e.target.value }); }} />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-lock" /></span>
                    </InputGroupAddon>
                    <Input type="password" placeholder="Password" disabled={this.state.frontLoading} value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }); }} />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Alert color="danger" isOpen={this.state.loginHasError} toggle={this.dismissLoginError}>
                    Your Username or Password was incorrect. Please try again.
                  </Alert>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Alert color="info" isOpen={this.state.userHasSignedUp} toggle={this.dismissUserSignedUp}>
                    Your account as been created. Please log into your account now.
                  </Alert>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button color="success" id="buttonLogin" disabled={this.state.frontLoading} onClick={this.tryLogin} >Login</Button>
                </Col>
                <Col>
                  <Button color="primary" id="buttonFlipCard" disabled={this.state.frontLoading} onClick={this.handleClick}>register</Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link to="/ForgotPassword">Forgot Password?</Link>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card key="back">
            <CardHeader className="bg-primary text-white">Signup
              <div id="loginPageBackLoader" className="loginLoader">
                <BarLoader width={348} loading={this.state.backLoading} height={5} color="#6D6D6D" />
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-user" /></span>
                    </InputGroupAddon>
                    <Input invalid={!this.state.firstNameValid} placeholder="First Name" disabled={this.state.backLoading} value={this.state.registerFirstName} onChange={(e) => { this.setState({ registerFirstName: e.target.value }); }} />
                    <div className="invalid-feedback">
                      Please enter a first name.
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-user" /></span>
                    </InputGroupAddon>
                    <Input invalid={!this.state.lastNameValid} placeholder="Last Name" disabled={this.state.backLoading} value={this.state.registerLastName} onChange={(e) => { this.setState({ registerLastName: e.target.value }); }} />
                    <div className="invalid-feedback">
                      Please enter a last name.
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-user" /></span>
                    </InputGroupAddon>
                    <Input invalid={!this.state.usernameValid} placeholder="Username" disabled={this.state.backLoading} value={this.state.registerUsername} onChange={(e) => { this.setState({ registerUsername: e.target.value }); }} />
                    <div className="invalid-feedback">
                      {this.state.registerUsernameError}
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-envelope" /></span>
                    </InputGroupAddon>
                    <Input invalid={!this.state.emailValid} placeholder="Email" disabled={this.state.backLoading} value={this.state.registerEmail} onChange={(e) => { this.setState({ registerEmail: e.target.value }); }} />
                    <div className="invalid-feedback">
                      Please enter a valid email.
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-phone" /></span>
                    </InputGroupAddon>
                    <Input invalid={!this.state.phoneNumberValid} placeholder="Phone Number" disabled={this.state.backLoading} value={this.state.registerPhoneNumber} onChange={(e) => { this.setState({ registerPhoneNumber: e.target.value }); }} />
                    <div className="invalid-feedback">
                      Please enter a valid phone number in the formart 1112223333.
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-home" /></span>
                    </InputGroupAddon>
                    <Input invalid={!this.state.addressValid} placeholder="Address" disabled={this.state.backLoading} value={this.state.registerAddress} onChange={(e) => { this.setState({ registerAddress: e.target.value }); }} />
                    <div className="invalid-feedback">
                      Please enter a valid address.
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-lock" /></span>
                    </InputGroupAddon>
                    <Input invalid={!this.state.passwordValid} type="password" placeholder="Password" disabled={this.state.backLoading} value={this.state.registerPassword} onChange={(e) => { this.setState({ registerPassword: e.target.value }); }} />
                    <div className="invalid-feedback">
                      Please enter a valid email.<br />
                      Atleast 1 lower, 1 upper, 1 special character and 1 digit
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <span className="input-group-text"><i className="fa fa-lock" /></span>
                    </InputGroupAddon>
                    <Input invalid={!this.state.verifyPasswordValid} type="password" disabled={this.state.backLoading} placeholder="Verify Password" value={this.state.registerVerifyPassword} onChange={(e) => { this.setState({ registerVerifyPassword: e.target.value }); }} />
                    <div className="invalid-feedback">
                      Passwords do not match.
                    </div>
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button color="success" id="buttonregister" disabled={this.state.backLoading} onClick={this.registerUser} >register</Button>
                </Col>
                <Col>
                  <Button color="primary" id="buttonBack" disabled={this.state.backLoading} onClick={this.handleClick}>Back</Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </ReactCardFlip>
      </div>
    );
  }
}

export default Login;
