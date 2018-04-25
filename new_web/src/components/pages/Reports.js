import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { Jumbotron } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, InsertModalHeader, DeleteButton } from 'react-bootstrap-table';
import { getTeams, getTeamReport } from '../../utils/HttpHelper';
import { getLocalToken, checkPermissions } from '../../utils/Auth';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Card, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      loaded: null,
      report: null,
      teamName: null,
      dropdownOpen: false,
      teamId: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    Promise.all([getTeams(getLocalToken())]).then((res) => {
        let teams = res[0][0];
        const teamResp = res[0][1];
        if (teamResp !== 200) {
          this.setState({
            teams,
          });
          return;
        }
        teams = teams.reverse();
        this.setState({
          teams,
          loaded: true
        });
      });
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  select = (event) => {
      const teamName = event.target.innerText;
    Promise.all([getTeamReport(getLocalToken(), event.target.id)]).then((res) => {
        let report = res[0][0];
        const teamResp = res[0][1];
        if (teamResp !== 200) {
          this.setState({
            report: null,
            teamName
          });
          return;
        }
        this.setState({
            report,
            teamName
          });
      });
  }

  dropDown = () => {
    return this.state.teams.map(team => <DropdownItem id={team.uid} onClick={this.select}>{team.name}</DropdownItem>);
  }

  render(){
    return (
      <Card>
        <CardBody>
        {this.state.loaded ? 
        <div>
        <h2 className="text-left">Report for {this.state.teamName}</h2>
        <Dropdown direction="right" className="text-left" style={{paddingBottom: '10px'}} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret >
        Select a team...
      </DropdownToggle>
          <DropdownMenu>
              {this.dropDown()}
          </DropdownMenu>
          </Dropdown>

          <BootstrapTable data={this.state.report} striped hover pagination search searchPlaceholder="Search..." exportCSV csvFileName={`Reports for ${this.state.teamName} ${new Date()}.csv`}>
            <TableHeaderColumn dataField="id" hidden autoValue isKey>Id</TableHeaderColumn>
            <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="project_name">Project</TableHeaderColumn>
            <TableHeaderColumn dataField="req_name" >Requirement</TableHeaderColumn>
            <TableHeaderColumn dataField="hours">Hours</TableHeaderColumn>
            <TableHeaderColumn dataField="money_earned">Money Earned</TableHeaderColumn>
          </BootstrapTable>
          </div>
    :
        <p>You are not leading any teams!</p>
    }
        
        </CardBody>
        <NotificationContainer />
      </Card>


    );
  }
}

export default Reports;
