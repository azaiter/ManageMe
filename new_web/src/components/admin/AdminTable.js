import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, DeleteButton, InsertModalHeader } from 'react-bootstrap-table';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { getUserInfo, updateUser, deleteUser, getAllPerms, assignPrivilage } from '../../utils/HttpHelper';
import { getLocalToken } from '../../utils/Auth';
import { register } from '../../utils/Auth';


class AdminTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      error: null,
      jobTypes: this.props.jobTypes,
      selectValue: [],
      removeSelected: true,
      disabled: false,
      crazy: false,
      stayOpen: false,
      value: [],
      rtl: false,
    };
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

  createCustomModalHeader = (closeModal, save) => (
    <InsertModalHeader
      title="Create User"
      beforeClose={this.beforeClose}
    />
    // hideClose={ true } to hide the close button
  )


  customSelectField = (onUpdate, props) => {
    const values = props.defaultValue;
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
          value={values}
          removeSelected={values}
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

  onAfterInsertRow = (row) => {
    register(row.first_name, row.last_name, row.email, row.phone, row.address, row.username, row.password);
  }

  render() {
    const options = {
      afterDeleteRow: this.deleteUser.bind(this),
      deleteBtn: this.createCustomDeleteButton,
      insertModalHeader: this.createCustomModalHeader,
      afterInsertRow: this.onAfterInsertRow,
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
      <div>

        <p style={{ color: 'red' }}>{this.state.error}</p>
        <BootstrapTable data={this.state.data} cellEdit={cellEdit} selectRow={selectRow} bordered={false} options={options} pagination search insertRow searchPlaceholder="Search..." deleteRow exportCSV csvFileName={`Current Userbase ${new Date()}.csv`}>
          <TableHeaderColumn dataField="uid" isKey dataSort autoValue hiddenOnInsert>UID</TableHeaderColumn>
          <TableHeaderColumn dataField="username" dataSort>User Name</TableHeaderColumn>
          <TableHeaderColumn dataField="password" hidden dataSort editable={{ type: 'password' }}>Password</TableHeaderColumn>
          <TableHeaderColumn dataField="first_name" dataSort>First Name</TableHeaderColumn>
          <TableHeaderColumn dataField="last_name" dataSort>Last Name</TableHeaderColumn>
          <TableHeaderColumn dataField="email" dataSort>E-Mail</TableHeaderColumn>
          <TableHeaderColumn dataField="phone" dataSort>Phone #</TableHeaderColumn>
          <TableHeaderColumn dataField="address" dataSort>Address</TableHeaderColumn>
          <TableHeaderColumn dataField="permissions" customEditor={{ getElement: this.customSelectField }} dataSort hiddenOnInsert>Role</TableHeaderColumn>

        </BootstrapTable>
      </div>


    );
  }
}

export default AdminTable;
