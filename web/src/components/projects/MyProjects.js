import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { getProjects, deleteProject, getProjectHours, getTeams, getTeamById } from '../../utils/HttpHelper';
import { BounceLoader } from 'react-spinners';
import { getLocalToken } from '../../utils/Auth';

class MyProjects extends React.Component {
    indication = () => 'You have no projects to work on'

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
          text: 'All', value: this.props.projects.length,
        }], // A numeric array is also available. the purpose of above example is custom the text
      };

      const columns = [{
        dataField: 'uid',
        text: 'Project ID',
        align: 'left',
      }, {
        dataField: 'name',
        text: 'Project Name',
        align: 'left',
      }, {
        dataField: 'desc',
        text: 'Project Description',
        align: 'left',
      }, {
        dataField: 'actions',
        text: '',
        align: 'right',
      }];

      return (
        <Card>
          <CardBody>
            <BootstrapTable keyField="uid" bordered={false} data={this.props.projects} columns={columns} pagination={paginationFactory(options)} noDataIndication={this.indication} />
          </CardBody>
        </Card>);
    }
}

export default withRouter(MyProjects);
