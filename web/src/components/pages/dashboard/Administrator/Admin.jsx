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
        name: "brad"
    }
    
  }

  

  render() {
    const data = [{
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
    function deleteButton(cell, row){
        return <button className="btn btn-danger btn-outline btn-rounded btn-block" onClick={(e) => deleteUser(cell)}>Disable User</button>;
    }

    function deleteUser(id){
        console.log("suh",id);
    }

    return (
        <div className="overview-page" key="overview"> 
        <ToolBar></ToolBar>
        <h2>Users:</h2> 
        <Jumbotron> 
            <BootstrapTable data={data} striped={true} hover={true}>
                <TableHeaderColumn dataField="id" isKey={true} dataSort={true}>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="email" dataSort={true}>Email</TableHeaderColumn>
                <TableHeaderColumn dataField="role" dataSort={true}>Role</TableHeaderColumn>
                <TableHeaderColumn dataField="memberSince" dataSort={true}>Member Since</TableHeaderColumn>
                <TableHeaderColumn dataField="delete" dataFormat={deleteButton}>Delete</TableHeaderColumn>
            </BootstrapTable>
        </Jumbotron> 
      </div>
          
        
    );
      
  }
}

export default Admin;
