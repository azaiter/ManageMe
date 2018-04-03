import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { BarLoader } from 'react-spinners';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Button, Card, CardBody, Modal, FormGroup, Input, ModalBody, ModalHeader, Row, Col, Label, ModalFooter, Table } from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getLocalToken } from '../../utils/Auth';
import { acceptChangeRequest, rejectChangeRequest, createChangeRequest, clockIn, clockOut } from '../../utils/HttpHelper';
import RequirementRow from './RequirementRow';

class RequirementTable extends React.Component {
  constructor(props) {
    super(props);

    let clockInButtonText = '';

    if (localStorage.getItem('req') != '' && localStorage.getItem('req') != null) {
      clockInButtonText = 'Clock Out';
    } else {
      clockInButtonText = 'Clock In';
    }

    this.state = {
      reqClockedInto: localStorage.getItem('req'),
      clockInButtonText,
      disabled: localStorage.getItem('disabled'),
      changeModal: false,
      requirementToUpdate: null,
      changeModalLoading: false,
    };
  }

  handleClock = (id) => {
    const tok = getLocalToken();
    const req = localStorage.getItem('req');
    if (this.state.disabled === 'true') {
      localStorage.setItem('req', '');
      localStorage.setItem('disabled', false);
      clockOut(localStorage.getItem('token'), id);
      this.setState({
        disabled: false,
        reqClockedInto: null,
        clockInButtonText: 'Clock In',
      });
      return;
    }

    localStorage.setItem('req', id);
    localStorage.setItem('disabled', true);
    this.setState({
      disabled: 'true',
      reqClockedInto: id,
      clockInButtonText: 'Clock Out',
    });
    clockIn(localStorage.getItem('token'), id);
  }

  openChangeModal = (requirementId) => {
    let req = {};
    this.props.requirements.forEach((element) => {
      if (element.uid == requirementId) {
        req = element;
      }
    });

    this.setState({
      requirementToUpdate: requirementId,
      changeModal: true,
      changeModalName: req.name,
      changeModalDescription: req.desc,
      changeModalPriority: req.priority,
      changeModalSoftCap: req.soft_cap,
      changeModalHardCap: req.hard_cap,
      changeModalEstimate: req.estimate,
    });
  }

  sendRequirmentChangeForApproval = () => {
    this.setState({ changeModalLoading: true });
    createChangeRequest(localStorage.getItem('token'),
      this.state.requirementToUpdate,
      this.state.changeModalEstimate,
      this.state.changeModalDescription,
      this.state.changeModalName,
      this.state.changeModalSoftCap,
      this.state.changeModalHardCap,
      this.state.changeModalPriority).then((res) => {
      this.setState({
        changeModalLoading: false,
        requirementToUpdate: null,
        changeModal: false,
      });
    });
  }

  toggleChangeModal = () => {
    if (!this.state.changeModalLoading) {
      this.setState({
        changeModal: !this.state.changeModal,
      });
    }
  }

  render() {
    if (this.props.requirements.length == 0) {
      return (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center', columnSpan: '3' }}>
                {this.props.emptyTableMessage}
              </td>
            </tr>
          </tbody>
        </Table>
      );
    }
    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {
            this.props.requirements.map(req => (
              <RequirementRow showChangeModalFunction={this.openChangeModal} req={req} clockActionText={this.state.clockInButtonText} clockActionFunction={this.handleClock} />
              ))
          }
        </tbody>

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
      </Table>
    );
  }
}

export default RequirementTable;
