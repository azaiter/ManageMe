import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [{
            id: "jk12k3jkj12k3jk123k",
            name: "Zaiter",
            email: "zaiter@managme.tech",
            role: "Admin",
            memberSince: "7/8/17",
            delete: "mns23234dfmnAASDF213"
          },{
            id: "jkklj23k4j2k3j4k2j34",
            name: "Brad",
            email: "brad@managme.tech",
            role: "Developer",
            memberSince: "7/28/17",
            delete: "mns23234dfmnAASDF213"
          },{
            id: "mns23234dfmnAASDF213",
            name: "Trent",
            email: "trent@managme.tech",
            role: "Team Lead",
            memberSince: "8/8/17",
            delete: "mns23234dfmnAASDF213"
        }]
    }
    
  }

  deleteUser(rows) {
    let data = this.state.data.filter(i => {return rows.indexOf(i.id) === -1});
    console.log(data);
    this.setState({
      data: data,
    });
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

  afterSaveCell(row, cellName, cellValue) {
    console.log(row, cellName, cellValue)
  }

  jobTypes(row) {
    return ["Admin", "Project Manager", "Team Leader", "Developer"]
  }

  render() {

    const options = {
        afterDeleteRow: this.deleteUser.bind(this),
        deleteBtn: this.createCustomDeleteButton,
        afterInsertRow: this.insertRequirement,
        
    };
    
    const cellEdit = {
        mode: 'click', // click cell to edit
        blurToSave: true,
        afterSaveCell: this.afterSaveCell,
      };
  
      const selectRow = {
        mode: 'checkbox',
        bgColor: '#cccccc',
      };

    return (
        <div className="overview-page" key="overview"> 
        <ToolBar></ToolBar>
        <h2>Users:</h2> 
        <Jumbotron> 
            <BootstrapTable data={this.state.data} striped={true} hover={true} cellEdit={ cellEdit } selectRow={ selectRow } options={options} pagination search searchPlaceholder='Search...' deleteRow exportCSV csvFileName={"Current Userbase " + new Date() +".csv"}>
                <TableHeaderColumn dataField="id" isKey={true} dataSort={true}>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="email" dataSort={true}>Email</TableHeaderColumn>
                <TableHeaderColumn dataField="role" editable={ { type: 'select', options: { values: this.jobTypes } } } dataSort={true}>Role</TableHeaderColumn>
                <TableHeaderColumn dataField="memberSince" dataSort={true} editable={false}>Member Since</TableHeaderColumn>
            </BootstrapTable>
        </Jumbotron> 
      </div>
          
        
    );
      
  }
}

export default Admin;
