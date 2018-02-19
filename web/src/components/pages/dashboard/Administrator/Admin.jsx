import React, { PropTypes, Component } from 'react';
import { Link } from "react-router";
import {Jumbotron} from 'react-bootstrap';
import ToolBar from '../../../layouts/ToolBar'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import AddUser from "../Forms/AddUser"

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: [{
            id: "1",
            firstName: "Zaiter",
            lastName: "Z",
            userName: "zzzzaiter",
            email: "zaiter@managme.tech",
            phone: "9999999999",
            address: "123 zaiter street",
            role: "Admin",
            memberSince: "7/8/17",
            delete: "1"
          },{
            id: "2",
            firstName: "Brad",
            lastName: "C",
            userName: "bchip",
            email: "chip@managme.tech",
            phone: "9999999999",
            address: "123 chip street",
            role: "Admin",
            memberSince: "7/10/17",
            delete: "2"
          },{
            id: "3",
            firstName: "trent",
            lastName: "t",
            userName: "tttttrent",
            email: "trent@managme.tech",
            phone: "9999999999",
            address: "123 trent street",
            role: "Admin",
            memberSince: "7/20/17",
            delete: "3"
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
        btnText='Disable Selected'
        btnContextual='btn-danger'
        />
    );
  }

  afterSaveCell(row, cellName, cellValue) {
    let data = this.state.data;
    data.push(row);
    this.setState({
      data: data
    });
    console.log(this.state.data);
  }

  jobTypes(row) {
    return ["Admin", "Project Manager", "Team Leader", "Developer"]
  }

  render() {

    const options = {
        afterDeleteRow: this.deleteUser.bind(this),
        deleteBtn: this.createCustomDeleteButton,
        afterInsertRow: this.afterSaveCell.bind(this),
        
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
            <BootstrapTable data={this.state.data} striped={true} hover={true} cellEdit={ cellEdit } selectRow={ selectRow } options={options} pagination search insertRow searchPlaceholder='Search...' deleteRow exportCSV csvFileName={"Current Userbase " + new Date() +".csv"}>
                <TableHeaderColumn dataField="id" isKey={true} dataSort={true} >ID</TableHeaderColumn>
                <TableHeaderColumn dataField="firstName" dataSort={true}>First Name</TableHeaderColumn>
                <TableHeaderColumn dataField="lastName" dataSort={true}>Last Name</TableHeaderColumn>
                <TableHeaderColumn dataField="userName" dataSort={true}>User Name</TableHeaderColumn>
                <TableHeaderColumn dataField="email" dataSort={true}>E-Mail</TableHeaderColumn>
                <TableHeaderColumn dataField="phone" dataSort={true}>Phone #</TableHeaderColumn>
                <TableHeaderColumn dataField="address" dataSort={true}>Address</TableHeaderColumn>
                <TableHeaderColumn dataField="role" editable={ { type: 'select', options: { values: this.jobTypes } } } dataSort={true}>Role</TableHeaderColumn>
                <TableHeaderColumn dataField="memberSince" dataSort={true}>Member Since</TableHeaderColumn>
            </BootstrapTable>
        </Jumbotron> 

        
      </div>
          
        
    );
      
  }
}

export default Admin;
