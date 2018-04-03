import React, { PropTypes, Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, DeleteButton, InsertModalHeader } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { getTeamMembers, removeUserFromTeam, addUserToTeam, getUserInfo, updateUser, assignPrivilage } from '../../utils/HttpHelper';
import { getLocalToken } from '../../utils/Auth';

class Team extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamId: this.props.match.params.id,
      name: this.props.match.params.name,
      data: [],
      error: null,
      jobTypes: [],
      selectValue: [],
      removeSelected: true,
      disabled: false,
      stayOpen: false,
      rtl: false,
      users: [],
      emails: [],
    };
    this.getData();
  }

  getData() {
    getTeamMembers(getLocalToken(), this.state.teamId).then((res) => {
      const json = res[0];
      const status = res[1];
      getUserInfo(getLocalToken()).then((resp) => {
        const users = resp[0];
        const respStatus = resp[1];
        if (respStatus !== 200) {
          return;
        }
        const emails = users.map(u => u.email);
        if (json.length > 0) {
          json.map((i) => { if (i.isLead === 0) { i.isLead = 'F'; } else { i.isLead = 'T'; } });
          this.setState({
            data: json,
            users,
            emails,
          });
          return;
        }
        this.setState({
          users,
          emails,
        });
      });
    });
  }


  deleteUser(rows) {
    removeUserFromTeam(getLocalToken(), this.state.teamId, rows[0]);
    const data = this.state.data.filter(i => rows.indexOf(i.uid) === -1);
    this.setState({
      data,
    });
  }

  createCustomDeleteButton = onClick => (
    <DeleteButton
      disabled={this.state.perm}
      btnText="Remove User From Team"
      btnContextual="btn-danger"
    />
  )

  beforeSaveCell(row, cellName, cellValue) {
    if (cellName === 'permissions') {
      cellValue = cellValue.filter((item, pos) => cellValue.indexOf(item) === pos);
      cellValue.map(v => assignPrivilage(getLocalToken(), v, row.uid).then(() => getUserInfo(localStorage.getItem('token')).then((res) => {
        const json = res[0];
        const status = res[1];
        if (status !== 200) {
          return;
        }
        json.map(person => person.permissions = person.permissions.map(role => role.desc));
        this.setState({
          data: json,
          error: null,
        });
      })));
    } else {
      updateUser(localStorage.getItem('token'), row.uid, cellName, cellValue).then((res) => {
        const json = res[0];
        const status = res[1];
        const data = this.state.data;
        if (status !== 200) {
          this.setState({
            error: Object.values(json.message),
            data,
          });
        }
        getUserInfo(localStorage.getItem('token')).then((res) => {
          const json = res[0];
          const status = res[1];
          if (status !== 200) {
            return;
          }
          json.map(person => person.permissions = person.permissions.map(role => role.desc));
          this.setState({
            data: json,
            error: null,
          });
        });
      });
    }

    return true;
  }

  jobTypes(row) {
    return this.state.jobTypes;
  }


  onTogglePerm(event) {
    const n = event.currentTarget.name;
    if (this.state.selectValue.indexOf(n) < 0) {
      this.setState({ selectValue: this.state.selectValue.concat([n]) });
    } else {
      this.setState({ selectValue: this.state.selectValue.filter(r => r !== n) });
    }
  }

  customSelectField = (onUpdate, props) => {
    const values = [];
    function handleSelectChange(value) {
      values.push(value);
    }
    return (
      <div style={{ height: '200px' }}>
        <Select
          closeOnSelect={!this.state.stayOpen}
          disabled={this.state.disabled}
          multi
          onChange={handleSelectChange}
          options={this.state.jobTypes}
          placeholder="Select roles"
          value={this.state.selectedOption && this.state.selectedOption.value}
          removeSelected={this.state.removeSelected}
          rtl={this.state.rtl}
          simpleValue
        />
        <button
          className="btn btn-info btn-xs textarea-save-btn"
          onClick={() => { onUpdate(values); }}
        >
          save
        </button>
      </div>
    );
  }

  onAddRow(row) {
    const obj = this.state.users.find(u => u.email === row.email);
    addUserToTeam(getLocalToken(), this.state.teamId, obj.uid).then(() => {
      this.getData();
    });
  }

  createCustomModalHeader = (closeModal, save) => (
    <InsertModalHeader
      title="Add Member to Team"
      beforeClose={this.beforeClose}
      onModalClose={() => this.handleModalClose(closeModal)}
    />
    // hideClose={ true } to hide the close button
  )

  render() {
    console.log(this.state.data);
    const options = {
      afterDeleteRow: this.deleteUser.bind(this),
      deleteBtn: this.createCustomDeleteButton,

      onAddRow: this.onAddRow.bind(this),
      noDataText: 'There are no users part of this team!',
      insertModalHeader: this.createCustomModalHeader,
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
        <h2>{this.state.name} Members:</h2>

        <Jumbotron>
          <p style={{ color: 'red' }}>{this.state.error}</p>
          <BootstrapTable data={this.state.data} striped hover cellEdit={cellEdit} selectRow={selectRow} options={options} pagination search insertRow searchPlaceholder="Search..." deleteRow exportCSV csvFileName={`Current Userbase ${new Date()}.csv`}>
            <TableHeaderColumn dataField="uid" isKey dataSort autovalue hiddenOnInsert>UID</TableHeaderColumn>
            <TableHeaderColumn dataField="username" editable={false} dataSort hiddenOnInsert>User Name</TableHeaderColumn>
            <TableHeaderColumn dataField="first_name" dataSort hiddenOnInsert>First Name</TableHeaderColumn>
            <TableHeaderColumn dataField="last_name" dataSort hiddenOnInsert>Last Name</TableHeaderColumn>
            <TableHeaderColumn dataField="email" editable={{ type: 'select', options: { values: this.state.emails } }}>E-Mail</TableHeaderColumn>
            <TableHeaderColumn dataField="isLead" editable={{ type: 'checkbox', options: { values: 'Y:N' } }} dataSort>Team Lead</TableHeaderColumn>

          </BootstrapTable>
        </Jumbotron>


      </div>


    );
  }
}

export default Team;
