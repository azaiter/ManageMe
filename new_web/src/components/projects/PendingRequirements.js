import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Card, CardBody } from 'reactstrap';

import { getProjects, deleteProject, getProjectHours, getTeams, getTeamById, deleteTeam } from '../../utils/HttpHelper';

class PendingRequirements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
    };
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
        text: '5', value: 5,
      }, {
        text: '10', value: 10,
      }, {
        text: 'All', value: this.state.projects.length,
      }], // A numeric array is also available. the purpose of above example is custom the text
    };

    const columns = [{
      dataField: 'Uid',
      text: 'Project ID',
      align: 'left',
    }, {
      dataField: 'Name',
      text: 'Project Name',
      align: 'left',
    }, {
      dataField: 'actions',
      align: 'right',
      text: '',
    }];

    if (this.props.projects.length == 0) {
      return null;
    }
    return (
      <Card>
        <CardBody>
          <h2 className="text-left">Pending Requirements</h2>
            <BootstrapTable keyField="Uid" bordered={false} data={this.props.projects} columns={columns} />
        </CardBody>
      </Card>
    );
  }
}

export default PendingRequirements;
