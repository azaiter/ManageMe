/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { getUserInfo } from '../../utils/HttpHelper';
import { userIsLoggedIn, deleteStore } from '../../utils/Auth';

import {
  Collapse,
  Navbar,
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
} from 'reactstrap';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    
    this.state = {

    }; 
  }

  render() {
    return (
      <div>
        
      </div>);
  }
}

export default Dashboard;
