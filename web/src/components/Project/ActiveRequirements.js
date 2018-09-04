import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn, DeleteButton, InsertModalHeader,InsertButton } from 'react-bootstrap-table';
import { BarLoader } from 'react-spinners';
import BootstrapTable2 from 'react-bootstrap-table-next';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Row, Col, Input, FormGroup, Label } from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getLocalToken, checkPermissions } from '../../utils/Auth';
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
      canEdit: false,
      canCreate: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    Promise.all([getRequirementsByProjectId(getLocalToken(), this.props.projectID),checkPermissions(16),checkPermissions(22)]).then((res) => {
      this.getRequirements(res[0]);
      this.setState({
        canCreate: res[1],
        canEdit: res[2],
      })
    });
  }

  getRequirements = (res) => {
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
      hidden={!this.state.canEdit}
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

  createCustomInsertButton = () => {
    return (
      <InsertButton
        btnText='Add'
        btnContextual='btn-primary'
        btnGlyphicon='fa-plus'
        hidden={!this.state.canCreate}/>
    );
  }

  indication = () => 'There are no requirements for this project';

  render() {
    const options = {
      afterDeleteRow: this.deleteRequirements.bind(this),
      deleteBtn: this.createCustomDeleteButton,
      onAddRow: this.onAddRow.bind(this),
      insertModalHeader: this.createCustomModalHeader,
      insertBtn: this.createCustomInsertButton
    };

    const selectRow = {
      mode: 'radio',
      bgColor: '#cccccc',
    };

    const cellEdit = {
      mode: this.state.canEdit ? 'click' : '', // click cell to edit
      blurToSave: true,
      beforeSaveCell: this.beforeSaveCell.bind(this),
    };

    return (
      <div>
        <Card>
          <CardBody>
            <h3 className="text-left">Active Requirements</h3>
            <div className="top-right-edit">
              <Button hidden={!(this.state.canCreate || this.state.canEdit)} onClick={() => this.toggleEditModal()}><i className="fa fa-edit" /></Button>
            </div>
            <RequirementTable requirements={this.props.requirements} emptyTableMessage="There are no active requirements for this project." />
          </CardBody>
        </Card>

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
