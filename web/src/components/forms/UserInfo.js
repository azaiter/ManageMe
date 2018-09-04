import React, { Component } from 'react';
import {
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
} from 'reactstrap';

import { updateUserInfo } from '../../utils/HttpHelper';
import { validateEmail, validatePhoneNumber, validatePassword } from '../../utils/RejexHelper';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    const { userInfo } = this.props;

    this.state = {
      firstNameValid: true,
      lastNameValid: true,
      emailValid: true,
      phoneValid: true,
      addressValid: true,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
      created: userInfo.created,
      uid: userInfo.uid,
    };
  }

  validateInputs = () => {
    this.setState({
      firstNameValid: (this.state.firstName.length > 0),
      lastNameValid: (this.state.lastName.length > 0),
      emailValid: validateEmail(this.state.email),
      phoneValid: validatePhoneNumber(this.state.phone),
      addressValid: (this.state.address.length > 0),
    });

    return (
      (this.state.firstName.length > 0) &&
      (this.state.lastName.length > 0) &&
      validateEmail(this.state.email) &&
      validatePhoneNumber(this.state.phone) &&
      (this.state.address.length > 0));
  }

  UpdateUser = () => {
    if (this.validateInputs()) {
      this.props.modalLoading(true);

      updateUserInfo(
        localStorage.getItem('token'),
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        this.state.phone,
        this.state.address,
        this.state.uid,
      ).then((res) => {
        const userInfo = res[0][0];
        const status = res[1];
        if (status === 200) {
          this.setState({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phone: userInfo.phone,
            address: userInfo.address,
            loading: false,
          });
        }

        this.props.modalLoading(false);
      });
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <span className="input-group-text"><i className="fa fa-user" /></span>
              </InputGroupAddon>
                <Input invalid={!this.state.firstNameValid} placeholder="First Name" disabled={this.state.loading} value={this.state.firstName} onChange={(e) => { this.setState({ firstName: e.target.value }); }} />
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
                  <Input invalid={!this.state.lastNameValid} placeholder="Last Name" disabled={this.state.loading} value={this.state.lastName} onChange={(e) => { this.setState({ lastName: e.target.value }); }} />
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
                    <span className="input-group-text"><i className="fa fa-envelope" /></span>
                  </InputGroupAddon>
                    <Input invalid={!this.state.emailValid} placeholder="Email" disabled={this.state.loading} value={this.state.email} onChange={(e) => { this.setState({ email: e.target.value }); }} />
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
                      <Input invalid={!this.state.phoneValid} placeholder="Phone Number" disabled={this.state.loading} value={this.state.phone} onChange={(e) => { this.setState({ phone: e.target.value }); }} />
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
                        <Input invalid={!this.state.addressValid} placeholder="Address" disabled={this.state.loading} value={this.state.address} onChange={(e) => { this.setState({ address: e.target.value }); }} />
                          <div className="invalid-feedback">
                      Please enter a valid address.
                          </div>
                    </InputGroup>
                  </Col>
                </Row>
                  <Row>
                    <Col style={{ fontSize: '14px' }}>
                      <label>Created:&nbsp;</label>{this.state.created}
                    </Col>
                  </Row>
                    <Row>
                      <Col style={{ fontSize: '14px' }}>
                        {
            // <Button color="success" className="float-right" onClick={this.UpdateUser}>Update</Button>
          }
                      </Col>
                    </Row>
      </div>
    );
  }
}

export default UserInfo;
