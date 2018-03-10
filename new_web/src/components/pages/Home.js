/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { getUserInfo } from '../../utils/HttpHelper';
import { userIsLoggedIn, deleteStore } from '../../utils/Auth';

import Dashboard from './Dashboard';
import Project from './Project';

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
} from 'reactstrap';

class Home extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      dashboard: true,
      projects: false,
      reports: false,
      admin: false,
      settings: false,
      username: 'User',
      rendered: '',
      previous: '',
    };

    userIsLoggedIn().then((res) => {
      if (!res) {
        this.props.history.push('/Login', null);
      }
    });
  }

  logout = () => {
    deleteStore();
    window.location.reload();
  }


  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <div>
        <Navbar color="default" light expand="md" fixed="top">
          <NavbarBrand href="/">ManageMe</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/" active={this.props.location.pathname === '/'}>Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Projects" active={this.props.location.pathname.indexOf('/Projects') > -1}>Projects</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Reports" active={this.props.location.pathname.indexOf('/Reports') > -1} >Reports</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/History" active={this.props.location.pathname.indexOf('/History') > -1}>History</NavLink>
              </NavItem>
            </Nav>
            <Nav navbar>
              <UncontrolledDropdown className="nav-item">
                <DropdownToggle nav caret>
                  {this.state.username}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    Option 1
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.logout}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink tag={Link} to="/Settings" active={this.props.location.pathname.indexOf('/Settings') > -1}><i className="fa fa-cog" /></NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Container fluid className="Home">
          <Row>
            <Col span="xs-12">
              <Route exact path="/" component={Dashboard} />
              <Route path="/Project/:id" component={Project} />
            </Col>
          </Row>
        </Container>
      </div>);
  }
}

export default Home;
