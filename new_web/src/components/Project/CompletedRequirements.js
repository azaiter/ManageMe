import React, { Component } from 'react';
import BootstrapTable2 from 'react-bootstrap-table-next';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getLocalToken } from '../../utils/Auth';
import { clockIn, clockOut, getRequirementsByProjectId, deleteReq, createRequirement, updateRequirement } from '../../utils/HttpHelper';

class CompletedRequirements extends React.Component {
  constructor(props) {
    super(props);
  }

  indication = () => 'There are no completed requirements for this project';

  render() {
    const options2 = {
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
        text: 'All', value: this.props.requirements,
      }], // A numeric array is also available. the purpose of above example is custom the text
    };

    const columns2 = [{
      dataField: 'uid',
      text: 'ID',
      align: 'left',
      hidden: true,
      isKey: true,
    }, {
      dataField: 'name',
      text: 'Name',
      align: 'left',
    }, {
      dataField: 'desc',
      text: 'Description',
      align: 'left',
    }, {
      dataField: 'priority',
      text: 'Priority',
      align: 'right',
      headerAlign: 'right',
    }, {
      dataField: 'soft_cap',
      text: 'Soft Cap (Hr)',
      align: 'right',
      headerAlign: 'right',
    }, {
      dataField: 'hard_cap',
      text: 'Hard Cap (Hr)',
      align: 'right',
      headerAlign: 'right',
    }, {
      dataField: 'estimate',
      text: 'Estimate',
      align: 'right',
      headerAlign: 'right',
    }, {
      dataField: 'actions',
      text: '',
      align: 'right',
    }];

    return (
      <div>
        <Card>
          <CardBody>
            <h3 className="text-left">Completed Requirements</h3>
            <BootstrapTable2 keyField="uid" bordered={false} data={this.props.requirements} columns={columns2} pagination={paginationFactory(options2)} noDataIndication={this.indication} />
          </CardBody>
        </Card>
      </div >
    );
  }
}

export default CompletedRequirements;
