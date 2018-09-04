/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Avatar from 'react-avatar';
import { BarLoader } from 'react-spinners';


import { getMyInfo } from '../../utils/HttpHelper';
import { userIsLoggedIn, deleteStore } from '../../utils/Auth';

import Dashboard from './Dashboard';
// import Project from './Project';
import UserInfo from '../forms/UserInfo';
import CreateProject from '../forms/CreateProject';
import Projects from './Projects';
import Admin from './Admin';
import Project from './Project';
import Team from './Team';
import Teams from './Teams';
import Reports from './Reports';
import { checkPermissions, checkAdmin } from '../../utils/Auth';


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
      modalLoading: false,
      userInfo: {
        address: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        uid: '',
        username: '',
      },
      waiting: true,
      admin: null,
    };
  }

  componentDidMount() {
    this.checkPerms();
  }

  checkPerms = () => {
    Promise.all([checkPermissions(7), checkAdmin()]).then((res) => {
      const reports = res[0];
      const admin = res[1];
      this.setState({
        reports,
        admin,
      });
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
    if (!this.state.modalLoading) {
      this.setState({
        modalIsOpen: !this.state.modalIsOpen,
        modalLoading: false,
      });
    }
  }

  modalLoading = (modalLoading) => {
    this.setState({ modalLoading });
  }

  viewMyInfo = () => {
    this.setState({
      modalIsOpen: true,
      modalSize: 'md',
      modalComponent: <UserInfo userInfo={this.state.userInfo} modalLoading={this.modalLoading} />,
      modalTitle: 'My User Info',
    });
  }

  viewCreateProject = () => {
    this.setState({
      modalIsOpen: true,
      modalSize: 'lg',
      modalComponent: <CreateProject modalLoading={this.modalLoading} toggleModal={this.toggleModal} />,
      modalTitle: 'Create A Project',
    });
  }

  componentWillMount() {
    userIsLoggedIn().then(async (res) => {
      if (!res) {
        this.props.history.push('/Login', null);
      } else {
        const res2 = await getMyInfo(localStorage.getItem('token'));
        const userInfo = res2[0][0];

        this.setState({
          userInfo,
          waiting: false,
        });
      }
    });
  }

  render() {
    if (this.state.waiting) {
      console.log('Waiting');
      return null;
    }
    return (
      <div>
        <Navbar color="default" light expand="md" fixed="top">
          <NavbarBrand href="/" className="text-primary">ManageMe</NavbarBrand>
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
                <NavLink tag={Link} to="/Teams" active={this.props.location.pathname.indexOf('/Teams') === 0}>Teams</NavLink>
              </NavItem>
              {this.state.reports ? <NavItem> <NavLink tag={Link} to="/Reports" active={this.props.location.pathname.indexOf('/Reports') === 0} >Reports</NavLink></NavItem> : null}
              {
              //<NavItem>
                //<NavLink tag={Link} to="/History" active={this.props.location.pathname.indexOf('/History') === 0}>History</NavLink>
              //</NavItem>
              }
              {this.state.admin ? <NavItem><NavLink tag={Link} to="/Admin" active={this.props.location.pathname.indexOf('/Admin') === 0}>Admin</NavLink></NavItem> : null }
            </Nav>
            <Nav navbar>
              <UncontrolledDropdown className="nav-item">
                <DropdownToggle nav caret>
                  {`${this.state.userInfo.firstName} ${this.state.userInfo.lastName}`}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={this.viewMyInfo}>
                    <Avatar name={`${this.state.userInfo.firstName.toLowerCase()} ${this.state.userInfo.lastName.toLowerCase()}`} size={150} round />
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.logout} style={{ textAlign: 'center' }}>
                      Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              {
              //<NavItem>
                //<NavLink tag={Link} to="/Settings" active={this.props.location.pathname.indexOf('/Settings') > -1}><i className="fa fa-cog" /></NavLink>
              //</NavItem>
              }
            </Nav>
          </Collapse>
        </Navbar>
        <Container fluid className="Home">
          <Row>
            <Col span="xs-12">
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/Projects" component={() => <Projects viewCreateProject={this.viewCreateProject} />} />
              <Route exact path="/Teams" component={Teams} />
              <Route exact path="/Team/:id/:name" component={Team} />
              <Route exact path="/Reports/" component={Reports} />
              <Route exact path="/Admin" component={Admin} />
              <Route path="/Project/:id" component={Project} />
            </Col>
          </Row>
        </Container>

        <Modal id="modalHome" backdrop="static" keyboard={false} isOpen={this.state.modalIsOpen} toggle={this.toggleModal} centered size={this.state.modalSize}>
          <div className="modal-loading-bar">
            <BarLoader width="100%" loading={this.state.modalLoading} height={5} color="#6D6D6D" />
          </div>
          <ModalHeader toggle={this.toggleModal}>{this.state.modalTitle}
          </ModalHeader>
          <ModalBody>
            {this.state.modalComponent}
          </ModalBody>
        </Modal>
      </div>);
  }
}

export default Home;
