import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Jumbotron } from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import AddUser from '../Forms/AddUser';
import { getUserInfo, updateUser, deleteUser, getAllPerms } from '../../../../utils/HttpHelper';
import { getLocalToken } from '../../../../actions/Auth';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: null,
      jobTypes: [],
    };
    getUserInfo(localStorage.getItem('token')).then((res) => {
      const json = res[0];
      const status = res[1];
      if (status !== 200) {
        return;
      }
      getAllPerms(localStorage.getItem('token')).then((resp) => {
        let perms = resp[0];
        const stat = resp[1];
        if (stat !== 200) {
          return;
        }
        perms = Object.keys(perms).map(k => perms[k].desc);
        console.log(perms);
        this.setState({
          data: json,
          jobTypes: perms,
        });
      });
    });
  }

  deleteUser(rows) {
    deleteUser(getLocalToken(), rows[0]);
    const data = this.state.data.filter(i => rows.indexOf(i.uid) === -1);
    this.setState({
      data,
    });
  }

  createCustomDeleteButton = onClick => (
    <DeleteButton
      disabled={this.state.perm}
      btnText="Disable Selected"
      btnContextual="btn-danger"
    />
  )

  beforeSaveCell(row, cellName, cellValue) {
    updateUser(localStorage.getItem('token'), row.uid, cellName, cellValue).then((res) => {
      const json = res[0];
      const status = res[1];
      const data = this.state.data;
      if (status !== 200) {
        this.setState({
          error: Object.values(json.message),
          data,
        });
        return false;
      }
      getUserInfo(localStorage.getItem('token')).then((res) => {
        const json = res[0];
        const status = res[1];
        if (status !== 200) {
          return;
        }
        this.setState({
          data: json,
          error: null,
        });
      });
      return true;
    });
    return false;
  }

  jobTypes(row) {
    return this.state.jobTypes;
  }

  render() {
    const options = {
      afterDeleteRow: this.deleteUser.bind(this),
      deleteBtn: this.createCustomDeleteButton,

    };

    const cellEdit = {
      mode: 'click', // click cell to edit
      blurToSave: true,
      beforeSaveCell: this.beforeSaveCell.bind(this),
    };

    const selectRow = {
      mode: 'radio',
      bgColor: '#cccccc',
    };

    return (
      <div className="overview-page" key="overview">
        <ToolBar />
        <h2>Users:</h2>

        <Jumbotron>
          <p style={{ color: 'red' }}>{this.state.error}</p>
          <BootstrapTable data={this.state.data} striped hover cellEdit={cellEdit} selectRow={selectRow} options={options} pagination search insertRow searchPlaceholder="Search..." deleteRow exportCSV csvFileName={`Current Userbase ${new Date()}.csv`}>
            <TableHeaderColumn dataField="uid" isKey dataSort >UID</TableHeaderColumn>
            <TableHeaderColumn dataField="username" editable={false} dataSort>User Name</TableHeaderColumn>
            <TableHeaderColumn dataField="first_name" dataSort>First Name</TableHeaderColumn>
            <TableHeaderColumn dataField="last_name" dataSort>Last Name</TableHeaderColumn>
            <TableHeaderColumn dataField="email" dataSort>E-Mail</TableHeaderColumn>
            <TableHeaderColumn dataField="phone" dataSort>Phone #</TableHeaderColumn>
            <TableHeaderColumn dataField="address" dataSort>Address</TableHeaderColumn>
            <TableHeaderColumn dataField="permissions" editable={{ type: 'select', options: { values: this.state.jobTypes } }} dataSort>Role</TableHeaderColumn>

          </BootstrapTable>
        </Jumbotron>


      </div>


    );
  }
}

export default Admin;
