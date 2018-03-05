/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { getUserInfo } from '../../utils/HttpHelper';
import { userIsLoggedIn } from '../../utils/Auth';

import Dashboard from './Dashboard';
import Project from './Project';

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
      username: 'User',
    };

    if (!userIsLoggedIn()) {
      this.props.history.push('/Login', null);
    }
  }

  setActive = (link) => {
    this.setState({
      dashboard: false,
      projects: false,
      reports: false,
      admin: false,
    });

    switch (link) {
      case 'Dashboard':
        this.setState({
          dashboard: true,
        });
        break;
      case 'Projects':
        this.setState({
          projects: true,
        });
        break;
      case 'Reports':
        this.setState({
          reports: true,
        });
        break;
      case 'Admin':
        this.setState({
          admin: true,
        });
        break;
      default:

        break;
    }

    console.log(this.state);
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
                <NavLink tag={Link} to="/" active={this.state.dashboard} onMouseDown={() => this.setActive('Dashboard')}>Dashboard</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Projects" active={this.state.projects} onMouseDown={() => this.setActive('Projects')} >Projects</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Reports" active={this.state.reports} onMouseDown={() => this.setActive('Reports')} >Reports</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Admin" active={this.state.admin} onMouseDown={() => this.setActive('Admin')} >Admin</NavLink>
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
                  <DropdownItem>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
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
