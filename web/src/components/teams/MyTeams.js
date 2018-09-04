import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { getLocalToken, checkPermissions } from '../../utils/Auth';
import { getProjects, deleteProject, getProjectHours, getTeams, getTeamById, deleteTeam } from '../../utils/HttpHelper';
import { BounceLoader } from 'react-spinners';
import ToolBar from '../projects/ToolBar';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class MyTeams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      error: '',
      createTeam: false,
      showCreateButton: this.props.show,
    };
  }

  componentDidMount() {
    this.getTeams();
  }

  getTeams = () => {
    Promise.all([getTeams(getLocalToken()), checkPermissions(1), checkPermissions(23)]).then((res) => {
      let teams = res[0][0];
      const teamResp = res[0][1];
      const createTeam = res[1];
      const delTeam = res[2];
      if (teamResp !== 200) {
        this.setState({
          teams,
          createTeam,
        });
        return;
      }
      teams = teams.reverse();
      teams.forEach((element) => {
        if (this.props.show) {
          element.actions = <div><Button className="btn-success" onClick={() => this.viewTeam(element.uid, element.name)} >View</Button> {delTeam ? <Button className="btn-danger" onClick={() => { this.deleteTeam(element.uid); }} >Delete</Button> : null }</div>;
        }
      });
      this.setState({
        teams,
        createTeam,
      });
    });
  }

  deleteTeam = (teamId) => {
    deleteTeam(getLocalToken(), teamId).then((res) => {
      const json = res[0];
      const code = res[1];
      if (code !== 200) {
        NotificationManager.error(Object.values(res[0].message), 'Error', 3000);
        return;
      }
      NotificationManager.success(null, 'Success', 3000);
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

    refresh = () => {
      this.getTeams();
      NotificationManager.success(null, 'Success', 3000);
    }

    render() {
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
        <div>
          {this.state.createTeam && this.state.showCreateButton ? <ToolBar className="float-right" refresh={this.refresh} /> : null }
          <Card>
            <CardTitle className="bg-primary text-white">
            Teams
            </CardTitle>
            <CardBody>
              <BootstrapTable keyField="uid" bordered={false} data={this.state.teams} columns={columns} pagination={paginationFactory(options)} noDataIndication={this.indication} />
            </CardBody>
          </Card>
          <NotificationContainer />
        </div>);
    }
}

export default withRouter(MyTeams);
