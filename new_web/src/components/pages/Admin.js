/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import AdminTable from '../admin/AdminTable';
import CustCard from '../misc/CustCard';
import {
  Row,
  Col,
} from 'reactstrap';
import { getUserInfo, updateUser, deleteUser, getAllPerms, assignPrivilage } from '../../utils/HttpHelper';
import { getLocalToken } from '../../utils/Auth';
import { BarLoader } from 'react-spinners';


class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      jobTypes: [],
      loaded: false,
    };
    Promise.all([getUserInfo(getLocalToken()), getAllPerms(getLocalToken())]).then((res) => {
      const userInfo = res[0];
      const userInfoData = userInfo[0];
      const userInfoStatus = userInfo[1];
      const permInfo = res[1];
      const permInfoData = permInfo[0];
      const permInfoStatus = permInfo[1];
      if (userInfoStatus !== 200 || permInfoStatus !== 200) {
        return;
      }
      userInfoData.map(person => person.permissions = person.permissions.map(role => role.desc));
      this.setState({
        data: userInfoData,
        jobTypes: permInfoData,
        loaded: true,
      });
    });
  }

  render() {
    return (
      <div id="page-wrapper">
        {this.state.loaded ?
          <div>
            <Row>
              <Col xs="3" >
                <CustCard title="Total number of users" data={this.state.data.length} icon="fa-user" />
              </Col>
            </Row>
            <hr />
            <AdminTable data={this.state.data} jobTypes={this.state.jobTypes} />
          </div>
    :
          <BarLoader width="100%" height={1} color="#6D6D6D" />
    }

      </div>);
  }
}

export default Admin;
