/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CustCard from '../misc/CustCard';
import { getDashboardCardInfo } from '../../utils/HttpHelper';
import { userIsLoggedIn, deleteStore, getLocalToken, getLocalUid } from '../../utils/Auth';

import {
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
} from 'reactstrap';

class HeaderCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };

    Promise.all([getDashboardCardInfo(getLocalToken(), getLocalUid())]).then((res) => {
      const data = res[0][0][0];
      const cardStatus = res[0][1];
      if (cardStatus !== 200) {
        return;
      }
      console.log(data);
      this.setState({
        data,

      });
    });
  }

  render() {
    return (
      <div>
        {this.state.data ?

          <Row>
            <Col lg="3" md="6">
              <CustCard title="Hours Clocked" data={parseInt(this.state.data.hours_cloked)} icon="fa-clock" />
            </Col>

            <Col lg="3" md="6">
              <CustCard title="Clocked Into" data={this.state.data.is_clocked} icon="fa-check" />
            </Col>


            <Col lg="3" md="6">
              <CustCard title="Projects" data={this.state.data.num_projects} icon="fa-list" />
            </Col>

            <Col lg="3" md="6">
              <CustCard title="Teams Part Of" data={this.state.data.num_teams} icon="fa-users" />
            </Col>
          </Row>
      :


      null
    }

      </div>);
  }
}

export default HeaderCards;
