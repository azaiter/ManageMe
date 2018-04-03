import React, { Component } from 'react';
import BootstrapTable2 from 'react-bootstrap-table-next';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import RequirementTable from './RequirementTable';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody } from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getLocalToken } from '../../utils/Auth';
import { clockIn, clockOut, getRequirementsByProjectId, deleteReq, createRequirement, updateRequirement } from '../../utils/HttpHelper';

class CompletedRequirements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <h3 className="text-left">Completed Requirements</h3>
            <RequirementTable requirements={this.props.requirements} showRequestChangeButton={false} showCompleteButton={false} showClockActionButton={false} emptyTableMessage="There are no completed requirements for this project." />
          </CardBody>
        </Card>
      </div >
    );
  }
}

export default CompletedRequirements;
