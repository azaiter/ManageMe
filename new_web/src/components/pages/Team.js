import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Jumbotron } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, InsertModalHeader, DeleteButton } from 'react-bootstrap-table';
import { getTeamMembers, removeUserFromTeam, addUserToTeam, getUserInfo, makeTeamLead, updateUser } from '../../utils/HttpHelper';
import { getLocalToken, checkPermissions } from '../../utils/Auth';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Card, CardBody } from 'reactstrap';

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
      editTeam: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    Promise.all([getTeamMembers(getLocalToken(), this.state.teamId), getUserInfo(getLocalToken()), checkPermissions(2)]).then((res) => {
      const json = res[0][0];
      const teamMemberStatus = res[0][1];
      const users = res[1][0];
      const userInfoStatus = res[1][1];
      const editTeam = res[2];
      if (teamMemberStatus !== 200 || userInfoStatus !== 200) {
        return;
      }
      const emails = users.map(u => u.email);
      if (json.length > 0) {
        json.map((i) => { if (i.isLead === 0) { i.isLead = 'F'; } else { i.isLead = 'T'; } });
        this.setState({
          data: json,
          users,
          emails,
          editTeam,
        });
        return;
      }
      this.setState({
        users,
        emails,
        editTeam,
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
    if (cellName === 'isLead') {
      makeTeamLead(getLocalToken(), this.state.teamId, row.uid).then((res) => {
        if (res[1] !== 200) {
          return;
        }
        this.getData();
      });

      return true;
    }
    updateUser(getLocalToken(), row.uid, cellName, cellValue).then((res) => {
      const json = res[0];
      const status = res[1];
      const data = this.state.data;
      if (status !== 200) {
        this.setState({
          error: Object.values(json.message),
          data,
        });
      }
      this.getData();
    });

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

  onAddRow = (row) => {
    const obj = this.state.users.find(u => u.email === row.email);
    addUserToTeam(getLocalToken(), this.state.teamId, obj.uid).then((resp) => {
      if (resp[1] !== 200) {
        return;
      }
      if (row.isLead === 'Y') {
        makeTeamLead(getLocalToken(), this.state.teamId, obj.uid).then((res) => {
          if (res[1] !== 200) {
            return;
          }
          this.getData();
        });
      } else {
        this.getData();
      }
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
    const options = {
      afterDeleteRow: this.deleteUser.bind(this),
      deleteBtn: this.createCustomDeleteButton,
      onAddRow: this.onAddRow,
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
      <Card>
        <CardBody>
          <h2 className="text-left">{this.state.name} Members:</h2>
          <p style={{ color: 'red' }}>{this.state.error}</p>
          {this.state.editTeam ?
            <BootstrapTable data={this.state.data} striped hover cellEdit={cellEdit} selectRow={selectRow} options={options} pagination search insertRow searchPlaceholder="Search..." deleteRow exportCSV csvFileName={`Current Userbase ${new Date()}.csv`}>
              <TableHeaderColumn dataField="uid" isKey dataSort autovalue hiddenOnInsert>UID</TableHeaderColumn>
              <TableHeaderColumn dataField="username" editable={false} dataSort hiddenOnInsert>User Name</TableHeaderColumn>
              <TableHeaderColumn dataField="first_name" editable={false} dataSort hiddenOnInsert>First Name</TableHeaderColumn>
              <TableHeaderColumn dataField="last_name" editable={false} dataSort hiddenOnInsert>Last Name</TableHeaderColumn>
              <TableHeaderColumn dataField="email" editable={{ type: 'select', options: { values: this.state.emails } }}>E-Mail</TableHeaderColumn>
              <TableHeaderColumn dataField="isLead" editable={{ type: 'checkbox', options: { values: 'Y:N' } }} dataSort>Team Lead&nbsp;</TableHeaderColumn>
            </BootstrapTable>


        :

            <BootstrapTable data={this.state.data} striped hover pagination search searchPlaceholder="Search..." exportCSV csvFileName={`Current Userbase ${new Date()}.csv`}>
              <TableHeaderColumn dataField="uid" isKey dataSort autovalue hiddenOnInsert>UID</TableHeaderColumn>
              <TableHeaderColumn dataField="username" editable={false} dataSort hiddenOnInsert>User Name</TableHeaderColumn>
              <TableHeaderColumn dataField="first_name" editable={false} dataSort hiddenOnInsert>First Name</TableHeaderColumn>
              <TableHeaderColumn dataField="last_name" editable={false} dataSort hiddenOnInsert>Last Name</TableHeaderColumn>
              <TableHeaderColumn dataField="email" editable={false}>E-Mail</TableHeaderColumn>
              <TableHeaderColumn dataField="isLead" editable={false} dataSort>Team Lead&nbsp;</TableHeaderColumn>
            </BootstrapTable>


        }

        </CardBody>
      </Card>


    );
  }
}

export default Team;
