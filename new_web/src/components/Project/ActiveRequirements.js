import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, DeleteButton, InsertModalHeader } from 'react-bootstrap-table';
import { BarLoader } from 'react-spinners';
import BootstrapTable2 from 'react-bootstrap-table-next';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Row, Col, Input, FormGroup, Label } from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getLocalToken } from '../../utils/Auth';
import { clockIn, clockOut, getRequirementsByProjectId, deleteReq, createRequirement, updateRequirement, createChangeRequest } from '../../utils/HttpHelper';
import RequirementTable from './RequirementTable';

class ActiveRequirements extends React.Component {
  constructor(props) {
    super(props);

    let clockInButtonText = '';

    if (localStorage.getItem('req') != '' && localStorage.getItem('req') != null) {
      clockInButtonText = 'Clock Out';
    } else {
      clockInButtonText = 'Clock In';
    }

    this.state = {
      clockError: '',
      status: '',
      reqClockedInto: localStorage.getItem('req'),
      clockInButtonText,
      disabled: localStorage.getItem('disabled'),
      perm: false,
      error: '',
      editModal: false,
      changeModal: false,
      requirementToUpdate: null,
      changeModalLoading: false,
      requirements: [],
    };
  }

  componentDidMount() {
    this.getRequirements();
  }


  getRequirements = () => {
    getRequirementsByProjectId(getLocalToken(), this.props.projectID).then((res) => {
      const json = res[0];
      const status = res[1];
      if (status !== 200) {
        return;
      }

      const activeRequirements = [];

      json.forEach((element) => {
        switch (element.status) {
          case 1:
            activeRequirements.push(element);
            break;
          default:

            break;
        }
      });

      this.setState({
        requirements: activeRequirements,
      });
    });
  }

  requestRequirementChange = () => {

  }

  isClockedIn = req => this.state.reqClockedInto === req

  onAddRow(row) {
    createRequirement(getLocalToken(), this.props.projectID, row.estimate, row.desc, row.name, row.soft_cap, row.hard_cap, row.priority).then(() => {
      getRequirementsByProjectId(getLocalToken(), this.props.projectID).then((res) => {
        const json = res[0];
        const status = res[1];
        if (status !== 200) {
          return;
        }
        this.setState({
          requirements: this.formatRequirements(json),
        });
      });
    });
  }

  beforeSaveCell(row, cellName, cellValue) {
    updateRequirement(localStorage.getItem('token'), row.uid, cellName, cellValue).then((res) => {
      const json = res[0];
      const status = res[1];
      const requirements = this.props.requirements;
      if (status !== 200) {
        this.setState({
          error: Object.values(json.message),
        });
        return false;
      }
      getRequirementsByProjectId(getLocalToken(), this.props.projectID).then((resp) => {
        if (resp[1] !== 200) {
          return;
        }
        this.setState({
          requirements: this.formatRequirements(resp[0]),
        });
      });
      return true;
    });
    return false;
  }

  createCustomDeleteButton = onClick => (
    <DeleteButton
      disabled={this.state.perm}
      btnText="Delete Selected"
      btnContextual="btn-danger"
    />
  )

  createCustomModalHeader = (closeModal, save) => (
    <InsertModalHeader
      title="Add Requirement to Project"
      beforeClose={this.beforeClose}
    />
    // hideClose={ true } to hide the close button
  )


  priceFormatter(cell, row) { // String example
    return `<i class='glyphicon glyphicon-usd'></i> ${cell}`;
  }

  deleteRequirements(rows) {
    deleteReq(getLocalToken(), rows[0]);
    const requirements = this.props.requirements.filter(i => rows.indexOf(i.uid) === -1);
    this.setState({
      requirements,
    });
  }

  handleClock(id) {
    console.log(id);

    const tok = getLocalToken();
    const req = localStorage.getItem('req');
    if (this.state.disabled === 'true') {
      localStorage.setItem('req', '');
      localStorage.setItem('disabled', false);
      clockOut(localStorage.getItem('token'), id);
      this.setState({
        status: null,
        disabled: false,
        reqClockedInto: null,
        clockInButtonText: 'Clock In',
      });
      return;
    }

    localStorage.setItem('req', id);
    localStorage.setItem('disabled', true);
    this.setState({
      status: 'You are clocked in for this requirement!',
      disabled: 'true',
      reqClockedInto: id,
      clockInButtonText: 'Clock Out',
    });
    clockIn(localStorage.getItem('token'), id);
  }

  toggleEditModal = () => {
    this.setState({
      editModal: !this.state.editModal,
    });
  }


  formatRequirements = (requirements) => {
    const correctRequirements = [];

    requirements.forEach((element) => {
      if (element.status == 1) {
        const elementWithActions = element;
        elementWithActions.actions = (
          <div>
            <Button color="primary" onClick={() => this.handleClock(element.uid)} hidden={this.state.disabled == 'true' && this.state.reqClockedInto != element.uid}>{this.state.clockInButtonText}</Button>
            <Button onClick={() => this.openChangeModal(element.uid)} style={{ marginLeft: '5px' }}>Request Change</Button>
            <Button color="success" style={{ marginLeft: '5px' }}>Complete</Button>
          </div>
        );
        correctRequirements.push(element);
      }
    });

    return correctRequirements;
  }

  indication = () => 'There are no requirements for this project';

  render() {
    const options = {
      afterDeleteRow: this.deleteRequirements.bind(this),
      deleteBtn: this.createCustomDeleteButton,
      onAddRow: this.onAddRow.bind(this),
      insertModalHeader: this.createCustomModalHeader,
    };

    const selectRow = {
      mode: 'radio',
      bgColor: '#cccccc',
    };

    const cellEdit = {
      mode: 'click', // click cell to edit
      blurToSave: true,
      beforeSaveCell: this.beforeSaveCell.bind(this),
    };

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
        text: 'All', value: this.props.requirements.length,
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
            <h3 className="text-left">Active Requirements</h3>
            <div className="top-right-edit">
              <Button onClick={() => this.toggleEditModal()}><i className="fa fa-edit" /></Button>
            </div>
            <BootstrapTable2 keyField="uid" bordered={false} data={this.formatRequirements(this.props.requirements)} columns={columns2} pagination={paginationFactory(options2)} noDataIndication={this.indication} />
            <RequirementTable requirements={this.props.requirements} />
          </CardBody>
        </Card>

        <Modal isOpen={this.state.changeModal} toggle={() => this.toggleChangeModal()} backdrop="static" >
          <div className="modal-loading-bar">
            <BarLoader width="100%" loading={this.state.changeModalLoading} height={5} color="#6D6D6D" />
          </div>
          <ModalHeader toggle={() => this.toggleChangeModal()}>Request Requirement Change</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Name</Label>
                  <Input placeholder="Name" disabled={this.state.changeModalLoading} value={this.state.changeModalName} onChange={(e) => { this.setState({ changeModalName: e.target.value }); }} />
                  <div className="invalid-feedback">
                      Please enter a valid name.
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Description</Label>
                  <Input placeholder="Description" disabled={this.state.changeModalLoading} value={this.state.changeModalDescription} onChange={(e) => { this.setState({ changeModalDescription: e.target.value }); }} />
                  <div className="invalid-feedback">
                      Please enter a valid description.
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Priority</Label>
                  <Input placeholder="Priority" disabled={this.state.changeModalLoading} value={this.state.changeModalPriority} onChange={(e) => { this.setState({ changeModalPriority: e.target.value }); }} />
                  <div className="invalid-feedback">
                      Please enter a valid numerical priority.
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Soft Cap (Hr)</Label>
                  <Input placeholder="Soft Cap (Hr)" disabled={this.state.changeModalLoading} value={this.state.changeModalSoftCap} onChange={(e) => { this.setState({ changeModalSoftCap: e.target.value }); }} />
                  <div className="invalid-feedback">
                      Please enter a valid numerical soft cap.
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Hard Cap (Hr)</Label>
                  <Input placeholder="Soft Cap (Hr)" disabled={this.state.changeModalLoading} value={this.state.changeModalHardCap} onChange={(e) => { this.setState({ changeModalHardCap: e.target.value }); }} />
                  <div className="invalid-feedback">
                      Please enter a valid numerical hard cap.
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Estimate</Label>
                  <Input placeholder="Estimate" disabled={this.state.changeModalLoading} value={this.state.changeModalEstimate} onChange={(e) => { this.setState({ changeModalEstimate: e.target.value }); }} />
                  <div className="invalid-feedback">
                      Please enter a valid numeric estimate.
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" disabled={this.state.changeModalLoading} onClick={() => this.sendRequirmentChangeForApproval()}>Send For Approval</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.editModal} toggle={() => this.toggleEditModal()} className="modal-xl" backdrop="static" >
          <ModalHeader toggle={() => this.toggleEditModal()}>Edit Requirements</ModalHeader>
          <ModalBody>
            <BootstrapTable data={this.state.requirements} striped cellEdit={cellEdit} hover selectRow={selectRow} options={options} pagination search searchPlaceholder="Search..." insertRow deleteRow exportCSV csvFileName={`${this.state.name} ${new Date()}`}>
              <TableHeaderColumn dataField="uid" isKey autoValue dataSort hiddenOnInsert>UID</TableHeaderColumn>
              <TableHeaderColumn dataField="name" dataSort>Name</TableHeaderColumn>
              <TableHeaderColumn dataField="desc" dataSort>Description</TableHeaderColumn>
              <TableHeaderColumn dataField="priority" dataSort>Priority</TableHeaderColumn>
              <TableHeaderColumn dataField="soft_cap" dataSort>Soft Cap (Hr)</TableHeaderColumn>
              <TableHeaderColumn dataField="hard_cap" dataSort>Hard Cap (Hr)</TableHeaderColumn>
              <TableHeaderColumn dataField="estimate" dataSort>Estimate</TableHeaderColumn>
              <TableHeaderColumn dataField="created_by" dataSort hiddenOnInsert>Created By</TableHeaderColumn>
              <TableHeaderColumn dataField="created" dataSort hiddenOnInsert>Created</TableHeaderColumn>
            </BootstrapTable>
          </ModalBody>
        </Modal>
      </div >
    );
  }
}

export default ActiveRequirements;
