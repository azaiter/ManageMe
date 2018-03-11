import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  Button,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    console.log(props);
  }

  render() {
    return (
      <div>
        <div className="row">
          <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="username" value={this.props.userInfo.username} />
          </div>
        </div>
        <div className="row">
          <label htmlFor="firstname" className="col-sm-2 col-form-label">First Name</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="firstname" value={this.props.userInfo.first_name} />
          </div>
        </div>
      </div>
    );
  }
}

export default UserInfo;
