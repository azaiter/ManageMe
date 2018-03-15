/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import AdminTable from '../admin/AdminTable';

import {
  Row,
  Col,
} from 'reactstrap';


class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div id="page-wrapper">
        <AdminTable />
      </div>);
  }
}

export default Admin;
