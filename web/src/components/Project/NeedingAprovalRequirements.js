import React from 'react';
import { BarLoader } from 'react-spinners';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Button, Card, CardBody, Modal, ModalBody, ModalHeader, Row, Col, Label, ModalFooter, Table } from 'reactstrap';
import { checkPermissions } from '../../utils/Auth';
import { acceptChangeRequest, rejectChangeRequest } from '../../utils/HttpHelper';

class NeedingAprovalRequirements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      changeModal: false,
      changeModalLoading: false,
      oldReq: {},
      newReq: {},
      canApprove: false,
    };
  }

  componentDidMount() {
    checkPermissions(6).then((res) => {
      this.setState({
        canApprove: res,
      });
    });
  }

  openChangeModal = (newReqId, oldReqId) => {
    let newReq = {};
    let oldReq = {};
    this.props.newRequirements.forEach((element) => {
      if (element.uid == newReqId) {
        newReq = element;
      }
    });
    this.props.oldRequirements.forEach((element) => {
      if (element.uid == oldReqId) {
        oldReq = element;
      }
    });
    this.setState({
      changeModal: true,
      oldReq,
      newReq,
    });
  }

  toggleChangeModal = () => {
    if (!this.state.changeModalLoading) {
      this.setState({
        changeModal: !this.state.changeModal,
      });
    }
  }

  acceptRequirementChange = () => {
    this.setState({ changeModalLoading: true });
    acceptChangeRequest(localStorage.getItem('token'), this.state.newReq.uid).then((res) => {
      this.setState({
        changeModalLoading: false,
        changeModal: false,
      }, () => this.props.getRequirements());
    });
  }

  rejectRequirementChange = () => {
    this.setState({ changeModalLoading: true });
    rejectChangeRequest(localStorage.getItem('token'), this.state.newReq.uid).then((res) => {
      this.setState({
        changeModalLoading: false,
        changeModal: false,
      }, () => this.props.getRequirements());
    });
  }

  render() {
    if (this.props.newRequirements == 0 || !this.state.canApprove) {
      return null;
    }
    return (
      <div>
        <Modal isOpen={this.state.changeModal} size="lg" toggle={() => this.toggleChangeModal()} backdrop="static" >
          <div className="modal-loading-bar">
            <BarLoader width="100%" loading={this.state.changeModalLoading} height={5} color="#6D6D6D" />
          </div>
            <ModalHeader toggle={() => this.toggleChangeModal()}>Request Requirement Change</ModalHeader>
              <ModalBody>
                <Row>
                  <Col>
                    <h3 style={{ textAlign: 'center' }}>Old</h3>
                      <hr />
                        <Row>
                          <Col>
                            <Label style={{ fontWeight: 'bold', width: '120px' }}>Name:&nbsp;</Label><Label>{this.state.oldReq.name}</Label>
                          </Col>
                        </Row>
                          <Row>
                            <Col>
                              <Label style={{ fontWeight: 'bold', width: '120px' }}>Description:&nbsp;</Label><Label>{this.state.oldReq.desc}</Label>
                            </Col>
                          </Row>
                            <Row>
                              <Col>
                                <Label style={{ fontWeight: 'bold', width: '120px' }}>Priority:&nbsp;</Label><Label>{this.state.oldReq.priority}</Label>
                              </Col>
                            </Row>
                              <Row>
                                <Col>
                                  <Label style={{ fontWeight: 'bold', width: '120px' }}>Soft Cap (Hr):&nbsp;</Label><Label>{this.state.oldReq.soft_cap}</Label>
                                </Col>
                              </Row>
                                <Row>
                                  <Col>
                                    <Label style={{ fontWeight: 'bold', width: '120px' }}>Hard Cap (Hr):&nbsp;</Label><Label>{this.state.oldReq.hard_cap}</Label>
                                  </Col>
                                </Row>
                                  <Row>
                                    <Col>
                                      <Label style={{ fontWeight: 'bold', width: '120px' }}>Estimate:&nbsp;</Label><Label>{this.state.oldReq.estimate}</Label>
                                    </Col>
                                  </Row>
                  </Col>
                    <Col>
                      <h3 style={{ textAlign: 'center' }}>New</h3>
                        <hr />
                          <Row>
                            <Col>
                              <Label style={{ fontWeight: 'bold', width: '120px' }}>Name:&nbsp;</Label><Label>{this.state.newReq.name}</Label>
                            </Col>
                          </Row>
                            <Row>
                              <Col>
                                <Label style={{ fontWeight: 'bold', width: '120px' }}>Description:&nbsp;</Label><Label>{this.state.newReq.desc}</Label>
                              </Col>
                            </Row>
                              <Row>
                                <Col>
                                  <Label style={{ fontWeight: 'bold', width: '120px' }}>Priority:&nbsp;</Label><Label>{this.state.newReq.priority}</Label>
                                </Col>
                              </Row>
                                <Row>
                                  <Col>
                                    <Label style={{ fontWeight: 'bold', width: '120px' }}>Soft Cap (Hr):&nbsp;</Label><Label>{this.state.newReq.soft_cap}</Label>
                                  </Col>
                                </Row>
                                  <Row>
                                    <Col>
                                      <Label style={{ fontWeight: 'bold', width: '120px' }}>Hard Cap (Hr):&nbsp;</Label><Label>{this.state.newReq.hard_cap}</Label>
                                    </Col>
                                  </Row>
                                    <Row>
                                      <Col>
                                        <Label style={{ fontWeight: 'bold', width: '120px' }}>Estimate:&nbsp;</Label><Label>{this.state.newReq.estimate}</Label>
                                      </Col>
                                    </Row>
                    </Col>
                </Row>
              </ModalBody>
                <ModalFooter>
                  <Button color="danger" disabled={this.state.changeModalLoading} onClick={() => this.rejectRequirementChange()}>Reject</Button>
                    <Button color="success" disabled={this.state.changeModalLoading} onClick={() => this.acceptRequirementChange()}>Accept</Button>
                </ModalFooter>
        </Modal>

          <Card>
            <CardBody>
              <h3 className="text-left">Needs Approval</h3>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                        <th>Description</th>
                    </tr>
                  </thead>
                    <tbody>
                      {
                  this.props.newRequirements.map(element => (
                    <tr>
                      <td>{element.name}</td>
                        <td>{element.desc}</td>
                          <td style={{ textAlign: 'right' }}><Button color="primary" onClick={() => this.openChangeModal(element.uid, element.changed)}>View</Button></td>
                    </tr>
                    ))
                }
                    </tbody>
                </Table>
            </CardBody>
          </Card>
      </div >
    );
  }
}

export default NeedingAprovalRequirements;
