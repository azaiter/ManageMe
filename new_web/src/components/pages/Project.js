import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, DeleteButton, InsertModalHeader } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

import { getLocalToken } from '../../utils/Auth';
import { clockIn, clockOut, getRequirementsByProjectId, deleteReq, createRequirement, updateRequirement } from '../../utils/HttpHelper';

class Project extends React.Component {
  constructor(props) {
    super(props);
    let req = null;
    const getReq = localStorage.getItem('req');
    if (getReq) {
      req = getReq;
    }
    this.state = {
      projId: this.props.match.params.id,
      name: this.props.match.params.name,
      desc: this.props.match.params.desc,
      created: this.props.match.params.created,
      clockError: null,
      status: null,
      reqClockedInto: req,
      disabled: localStorage.getItem('disabled'),
      perm: false,
      data: null,
      error: null,
    };

    getRequirementsByProjectId(getLocalToken(), this.props.match.params.id).then((res) => {
      const json = res[0];
      const status = res[1];
      console.log(json);
      if (status !== 200) {
        return;
      }


      this.setState({
        data: json,
      });
    });
  }

  onAddRow(row) {
    createRequirement(getLocalToken(), this.state.projId, row.estimate, row.desc, row.name, row.soft_cap, row.hard_cap, row.priority).then(() => {
      getRequirementsByProjectId(getLocalToken(), this.props.match.params.id).then((res) => {
        const json = res[0];
        const status = res[1];
        if (status !== 200) {
          return;
        }
        this.setState({
          data: json,
        });
      });
    });
  }

  beforeSaveCell(row, cellName, cellValue) {
    updateRequirement(localStorage.getItem('token'), row.uid, cellName, cellValue).then((res) => {
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
      getRequirementsByProjectId(getLocalToken(), this.props.match.params.id).then((resp) => {
        if (resp[1] !== 200) {
          return;
        }
        this.setState({
          data: resp[0],
        });
      });
      return true;
    });
    return false;
  }

  createCustomDeleteButton = onClick => (
    <DeleteButton
      disabled={this.state.perm}
      btnText="Delete Selected"
      btnContextual="btn-danger"
    />
  )

  createCustomModalHeader = (closeModal, save) => (
    <InsertModalHeader
      title="Add Requirement to Project"
      beforeClose={this.beforeClose}
    />
    // hideClose={ true } to hide the close button
  )


  priceFormatter(cell, row) { // String example
    return `<i class='glyphicon glyphicon-usd'></i> ${cell}`;
  }

  clock(cell, row) {
    return <a id={row.uid} className="btn btn-primary" onClick={e => this.handleClock(e)} disabled={row.uid != this.state.reqClockedInto && this.state.disabled === 'true'}>Clock in/out</a>;
  }

  deleteRequirements(rows) {
    deleteReq(getLocalToken(), rows[0]);
    const data = this.state.data.filter(i => rows.indexOf(i.uid) === -1);
    this.setState({
      data,
    });
  }

  handleClock(e) {
    const tok = getLocalToken();
    const req = localStorage.getItem('req');
    if (this.state.disabled === 'true') {
      this.setState({
        status: null,
        disabled: false,
        reqClockedInto: null,
      });
      localStorage.setItem('req', '');
      localStorage.setItem('disabled', false);
      clockOut(localStorage.getItem('token'), e.target.id);
      return;
    }

    localStorage.setItem('req', e.target.id);
    localStorage.setItem('disabled', true);
    this.setState({
      status: 'You are clocked in for this requirement!',
      disabled: 'true',
      reqClockedInto: e.target.id,
    });
    clockIn(localStorage.getItem('token'), e.target.id);
  }

  render() {
    const options = {
      afterDeleteRow: this.deleteRequirements.bind(this),
      deleteBtn: this.createCustomDeleteButton,
      onAddRow: this.onAddRow.bind(this),
      insertModalHeader: this.createCustomModalHeader,
    };

    const selectRow = {
      mode: 'radio',
      bgColor: '#cccccc',
    };

    const cellEdit = {
      mode: 'click', // click cell to edit
      blurToSave: true,
      beforeSaveCell: this.beforeSaveCell.bind(this),
    };


    return (
      <div>
        <h2>Project:</h2>
        <Jumbotron>
          <h1>{this.state.name}</h1>
          <hr />
          Description: {this.state.desc}<br />
          Created: {this.state.created}
          <hr />
          <h3>Requirements:</h3>
          <p style={{ color: 'red' }}>{this.state.error}</p>
          <BootstrapTable data={this.state.data} striped cellEdit={cellEdit} hover selectRow={selectRow} options={options} pagination search searchPlaceholder="Search..." insertRow deleteRow exportCSV csvFileName={`${this.state.name} ${new Date()}`}>
            <TableHeaderColumn dataField="uid" isKey autoValue dataSort hiddenOnInsert>UID</TableHeaderColumn>
            <TableHeaderColumn dataField="name" dataSort>Name</TableHeaderColumn>
            <TableHeaderColumn dataField="desc" dataSort>Description</TableHeaderColumn>
            <TableHeaderColumn dataField="priority" dataSort>Priority</TableHeaderColumn>
            <TableHeaderColumn dataField="soft_cap" dataSort>Soft Cap (Hr)</TableHeaderColumn>
            <TableHeaderColumn dataField="hard_cap" dataSort>Hard Cap (Hr)</TableHeaderColumn>
            <TableHeaderColumn dataField="estimate" dataSort>Estimate</TableHeaderColumn>
            <TableHeaderColumn dataField="created_by" dataSort hiddenOnInsert>Created By</TableHeaderColumn>
            <TableHeaderColumn dataField="created" dataSort hiddenOnInsert>Created</TableHeaderColumn>
            <TableHeaderColumn editable={false} dataFormat={this.clock.bind(this)} >Action</TableHeaderColumn>
          </BootstrapTable>
          <hr />
          <h3>Documents:</h3>


        </Jumbotron>

      </div>


    );
  }
}

export default Project;
