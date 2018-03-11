/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Avatar from 'react-avatar';

import { getMyInfo } from '../../utils/HttpHelper';
import { userIsLoggedIn, deleteStore } from '../../utils/Auth';

import Dashboard from './Dashboard';
import Project from './Project';
import UserInfo from '../layouts/UserInfo';

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

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      modalIsOpen: false,
      modalSize: 'lg',
      modalTitle: 'None',
      userInfo: {
        address: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        uid: '',
        username: '',
        full_name: '',
      },

    };
  }

  async componentWillMount() {
    let res = await userIsLoggedIn();
    if (!res) {
      this.props.history.push('/Login', null);
    }
    res = await getMyInfo(localStorage.getItem('token'));
    const userInfo = res[0][0];
    this.setState({
      userInfo,
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

  toggleModal = () => {
    this.setState({
      modalIsOpen: !this.state.modalIsOpen,
    });
  }

  viewMyInfo = () => {
    console.log(this.state.userInfo);
    this.setState({
      modalIsOpen: true,
      modalSize: 'md',
      modalComponent: <UserInfo userInfo={this.state.userInfo} />,
      modalTitle: this.state.first_name,
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
                <NavLink tag={Link} to="/Projects" active={this.props.location.pathname.indexOf('/Projects') === 0}>Projects</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Reports" active={this.props.location.pathname.indexOf('/Reports') === 0} >Reports</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/History" active={this.props.location.pathname.indexOf('/History') === 0}>History</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/Admin" active={this.props.location.pathname.indexOf('/Admin') === 0}>Admin</NavLink>
              </NavItem>
            </Nav>
            <Nav navbar>
              <UncontrolledDropdown className="nav-item">
                <DropdownToggle nav caret>
                  {`${this.state.userInfo.first_name} ${this.state.userInfo.last_name}`}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={this.viewMyInfo}>
                    <Avatar name={`${this.state.userInfo.first_name.toLowerCase()} ${this.state.userInfo.last_name.toLowerCase()}`} size={150} round />
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.logout} style={{ textAlign: 'center' }}>
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

        <Modal isOpen={this.state.modalIsOpen} toggle={this.toggleModal} centered size={this.state.modalSize}>
          <ModalHeader toggle={this.toggleModal}>{this.state.modalTitle}</ModalHeader>
          <ModalBody>
            {this.state.modalComponent}
          </ModalBody>
        </Modal>
      </div>);
  }
}

export default Home;
