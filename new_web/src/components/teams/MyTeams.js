import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { getLocalToken } from '../../utils/Auth';
import { getProjects, deleteProject, getProjectHours, getTeams, getTeamById, deleteTeam } from '../../utils/HttpHelper';
import { BounceLoader } from 'react-spinners';

class MyTeams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      error: '',
    };
    this.getTeams();
  }

  getTeams = () => {
    Promise.all([getTeams(getLocalToken())]).then((res) => {
      let teams = res[0][0];
      const teamResp = res[0][1];
      if (teamResp !== 200) {
        return;
      }
      teams = teams.reverse();
      teams.forEach((element) => {
        element.actions = <div><Button className="btn-success" onClick={() => this.viewTeam(element.uid, element.name)} >View</Button> <Button className="btn-danger" onClick={() => this.deleteTeam(element.uid)} >Delete</Button></div>;
      });
      this.setState({
        teams,
      });
    });
  }

  deleteTeam = (teamId) => {
    deleteTeam(getLocalToken(), teamId).then((res) => {
      const json = res[0];
      const code = res[1];
      if (code !== 200) {
        this.setState({
          error: json.message,
        });
        return;
      }
      const teams = this.state.teams.filter(e => e.uid !== teamId);
      this.setState({
        teams,
      });
    });
  }


    viewTeam = (teamId, teamName) => {
      this.props.history.push(`/Team/${teamId}/${teamName}`, null);
    }


    indication = () => 'You are part of zero teams'

    render() {
      console.log(this.state.teams);
      const options = {
        paginationSize: 4,
        pageStartIndex: 0,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        // hideSizePerPage: true, // Hide the sizePerPage dropdown always
        // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        sizePerPageList: [{
          text: '10', value: 10,
        }, {
          text: '25', value: 25,
        }, {
          text: '50', value: 50,
        }, {
          text: 'All', value: this.state.teams.length,
        }], // A numeric array is also available. the purpose of above example is custom the text
      };

      const columns = [{
        dataField: 'uid',
        text: 'Team ID',
        align: 'left',
      }, {
        dataField: 'name',
        text: 'Team Name',
        align: 'left',
      }, {
        dataField: 'desc',
        text: 'Team Description',
        align: 'left',
      }, {
        dataField: 'actions',
        text: '',
        align: 'right',
      }];

      return (
        <Card>
          <CardBody>
            <h2 className="text-left">Teams</h2>
            <p style={{ color: 'red' }}>{this.state.error}</p>
            <BootstrapTable keyField="uid" bordered={false} data={this.state.teams} columns={columns} pagination={paginationFactory(options)} noDataIndication={this.indication} />
          </CardBody>
        </Card>);
    }
}

export default withRouter(MyTeams);
