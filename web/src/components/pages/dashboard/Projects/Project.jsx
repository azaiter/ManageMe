import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron, Modal} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar'
import {getLocalToken} from '../../../../actions/Auth'
import {clockIn, clockOut, getRequirementsByProjectId} from '../../../../utils/HttpHelper'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projId: this.props.location.query.id,
      name: this.props.location.query.name,
      desc: this.props.location.query.desc,
      created: this.props.location.query.created,
      clockError: null,
      status: null,
      reqClockedInto: null,
      disabled: false,
      perm: false,
      data : null
    }
    getRequirementsByProjectId(getLocalToken(), this.props.location.query.id).then(res => {
      let json = res[0];
      let status = res[1]
      if(status != 200){
        return;
      }
      console.log(json)
      this.setState({
        data: res[0]
      })
    })
  }

  handleClock(e){
    let tok = getLocalToken();
    if(this.state.disabled){
      this.setState({
        status: null,
        disabled: false,
        reqClockedInto: null
      })
      return;
    }
    this.setState({
      status: "You are clocked in for this requirement!",
      disabled: true,
      reqClockedInto: e.target.id
    })
    

  }

  deleteRequirements(rows) {
    let data = this.state.data.filter(i => {return rows.indexOf(i.name) === -1});
    this.setState({
      data: data,
    })
  }

  insertRequirement(row){
    let data = this.state.data;
    data.push(row);
  }

  createCustomDeleteButton = (onClick) => {
    return (
      <DeleteButton
        disabled={this.state.perm}
        btnText='Delete Selected'
        btnContextual='btn-danger'
        />
    );
  }

  priceFormatter(cell, row) {   // String example
    return `<i class='glyphicon glyphicon-usd'></i> ${cell}`;
  }

  clock(cell,row){
    return <a id={row.name} className="btn btn-primary" onClick={(e) => this.handleClock(e)} disabled={row.name != this.state.reqClockedInto && this.state.disabled}>Clock in/out</a>

  }
  

  render() {


    const options = {
      afterDeleteRow: this.deleteRequirements.bind(this),
      deleteBtn: this.createCustomDeleteButton,
      afterInsertRow: this.insertRequirement.bind(this),
    };

    const selectRow = {
      mode: 'checkbox',
      bgColor: '#cccccc'
    };

    
    return (
      <div className="overview-page" key="overview"> 
        <ToolBar></ToolBar>
        <h2>Project:</h2> 
        <Jumbotron> 
          <h1>{this.state.name}</h1> 
          <hr />
          Description: {this.state.desc}<br />
          Created: {this.state.created}
          <hr />
          <h3>Requirements:</h3>
          <BootstrapTable data={this.state.data} striped={true} hover={true}  selectRow={ selectRow } options={options} pagination search searchPlaceholder='Search...' insertRow deleteRow exportCSV csvFileName={this.state.name + " " + new Date()}>
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="desc" dataSort={true}>Description</TableHeaderColumn>
                <TableHeaderColumn dataField="notes" dataSort={true}>Notes</TableHeaderColumn>
                <TableHeaderColumn dataField="priority" dataSort={true}>Priority</TableHeaderColumn>
                <TableHeaderColumn dataField="soft_cap" dataSort={true}>Soft Cap (Hr)</TableHeaderColumn>
                <TableHeaderColumn dataField="hard_cap" dataSort={true}>Hard Cap (Hr)</TableHeaderColumn>
                <TableHeaderColumn dataField="estimate" dataSort={true}>Estimate</TableHeaderColumn>
                <TableHeaderColumn dataField="created_by" dataSort={true}>Created By</TableHeaderColumn>
                <TableHeaderColumn dataField="created" dataSort={true}>Created</TableHeaderColumn>
                <TableHeaderColumn  dataFormat={ this.clock.bind(this) } >Action</TableHeaderColumn>
            </BootstrapTable>
            <hr />
            <h3>Documents:</h3>
            <BootstrapTable data={this.state.data} striped={true} hover={true}  selectRow={ selectRow } options={options} pagination search searchPlaceholder='Search...' insertRow deleteRow exportCSV csvFileName={this.state.name + " " + new Date()}>
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="desc" dataSort={true}>Description</TableHeaderColumn>
                <TableHeaderColumn dataField="notes" dataSort={true}>Notes</TableHeaderColumn>
                <TableHeaderColumn dataField="priority" dataSort={true}>Priority</TableHeaderColumn>
                <TableHeaderColumn dataField="soft_cap" dataSort={true}>Soft Cap (Hr)</TableHeaderColumn>
                <TableHeaderColumn dataField="hard_cap" dataSort={true}>Hard Cap (Hr)</TableHeaderColumn>
                <TableHeaderColumn dataField="estimate" dataSort={true}>Estimate</TableHeaderColumn>
                <TableHeaderColumn dataField="created_by" dataSort={true}>Created By</TableHeaderColumn>
                <TableHeaderColumn dataField="created" dataSort={true}>Created</TableHeaderColumn>
                <TableHeaderColumn  dataFormat={ this.clock.bind(this) } >Action</TableHeaderColumn>
            </BootstrapTable>
        </Jumbotron> 
      </div>
      
      
    );
  }
}

export default Project;
