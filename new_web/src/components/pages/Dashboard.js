/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { getUserInfo } from '../../utils/HttpHelper';
import { userIsLoggedIn, deleteStore, getLocalToken, getLocalUid } from '../../utils/Auth';
import HeaderCards from '../dashboard/HeaderCards';
import HoursBreakdown from '../dashboard/HoursBreakdown';
import RecentProjects from '../dashboard/RecentProjects';
import ProjectBreakdown from '../dashboard/ProjectBreakdown';
import RequirementBreakdown from '../dashboard/RequirementBreakdown';
import RecentRequirements from '../dashboard/RecentRequirements';
import RecentActivity from '../dashboard/RecentActivity';
import { getDashboardCardInfo } from '../../utils/HttpHelper';
import MyProjects from '../projects/MyProjects';
import MyTeams from '../teams/MyTeams';

import {
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
      <div id="page-wrapper">
        <HeaderCards />
        <Row>
          <Col lg="8">
            <Row>
              <Col lg="12">
                <HoursBreakdown />
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" md="6" lg="6">
                <RecentRequirements />
              </Col>
              <Col xs="12" sm="12" md="6" lg="6">
                <RecentProjects />
              </Col>
            </Row>
            <Row>
              <Col lg="6" />
            </Row>
          </Col>
          <Col lg="4">
            <ProjectBreakdown />
            <RecentActivity />
            <MyTeams showCreateButton={false} />
          </Col>
        </Row>
      </div>);
  }
}

export default Dashboard;
