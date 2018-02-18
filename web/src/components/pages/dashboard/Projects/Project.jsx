import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar'
import {getLocalToken} from '../../../../actions/Auth'
import {clockIn, clockOut} from '../../../../utils/HttpHelper'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'BlueFox',
      desc: 'Moving on-prem databases to Microsoft Azure.',
      due: 'December 2017',
      created: 'Feburary 2nd 2017',
      clockError: null,
      status: null,
      reqClockedInto: null,
      disabled: false,
      perm: false,
      data : [{
          name: "Clean up legacy databases",
          time: "5",
        },{
          name: "Notify dev teams about connection string change",
          time: "6",
        },{
          name: "Move to Azure",
          time: "7",
      }]
    }
    
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
          Due: {this.state.due} <br />
          Created: {this.state.created}
          <hr />
          <h3>Requirements:</h3>
          <BootstrapTable data={this.state.data} striped={true} hover={true}  selectRow={ selectRow } options={options} pagination search searchPlaceholder='Search...' insertRow deleteRow exportCSV csvFileName={this.state.name + " " + new Date()}>
                <TableHeaderColumn dataField="name" isKey={true} dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="time" dataSort={true} width='20%'>Time Clocked In</TableHeaderColumn>
                <TableHeaderColumn  dataFormat={ this.clock.bind(this) } width='15%'>Action</TableHeaderColumn>
            </BootstrapTable>
        </Jumbotron> 
      </div>
      
      
    );
  }
}

export default Project;
