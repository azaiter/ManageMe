import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { BarLoader, RingLoader } from 'react-spinners';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Button, Card, CardBody, Modal, FormGroup, Input, ModalBody, ModalHeader, Row, Col, Label, ModalFooter, Table, Jumbotron } from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getLocalToken } from '../../utils/Auth';
import { acceptChangeRequest, rejectChangeRequest } from '../../utils/HttpHelper';
import RequirementComments from './RequirementComments';

class RequirementRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showReqDetails: { display: 'none' },
      chevron: 'fa fa-chevron-down',
      reqDetailsVisible: false,
      showClockActionButton: this.props.showClockActionButton != null ? this.props.showClockActionButton : true,
      showRequestChangeButton: this.props.showRequestChangeButton != null ? this.props.showRequestChangeButton : true,
      showCompleteButton: this.props.showCompleteButton != null ? this.props.showCompleteButton : true,
    };
  }

  toggleRecDetails = () => {
    if (this.state.reqDetailsVisible) {
      this.setState({
        showReqDetails: { display: 'none' },
        chevron: 'fa fa-chevron-down',
        reqDetailsVisible: false,
      });
    } else {
      this.setState({
        showReqDetails: {},
        chevron: 'fa fa-chevron-up',
        reqDetailsVisible: true,
      });
    }
  }

  render() {
    const { req } = this.props;
    const { clockActionText } = this.props;
    return (
      <React.Fragment>
        <tr>
          <td>{req.name}</td>
          <td>{req.desc}</td>
          <td style={{ textAlign: 'right' }}><Button onClick={() => this.props.clockActionFunction(req.uid)} hidden={!this.state.showClockActionButton} hidden={this.props.hideClockActionButton} color="primary">{clockActionText}</Button><Button onClick={() => this.toggleRecDetails()} style={{ marginLeft: '10px' }}><i className={this.state.chevron} /></Button></td>
        </tr>
        <tr style={this.state.showReqDetails}>
          <td colSpan="3">
            <Jumbotron style={{ padding: '10px' }}>
              <Row>
                <Col xs="6" sm="6" md="6" lg="7">

                  <span
                    style={{
                      fontSize: '18px',
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      display: req.clocked_in == 'Y' ? 'content' : 'none',
                    }}
                    className="text-success"
                  >Being Worked On
                  </span>

                  <h3>{req.name}</h3>
                  <hr style={{ marginTop: '0px' }} />
                  <span style={{ fontSize: '17px' }}>{req.desc}</span>
                  <br /><br />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', width: '160px' }}>Created:&nbsp;</span> <span style={{ fontSize: '14px' }}>{req.created}</span>
                  <br />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', width: '160px' }}>Priority:&nbsp;</span> <span style={{ fontSize: '14px' }}>{req.priority}</span>
                  <br />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', width: '160px' }}>Soft Cap (Hr):&nbsp;</span> <span style={{ fontSize: '14px' }}>{req.soft_cap}</span>
                  <br />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', width: '160px' }}>Hard Cap (Hr):&nbsp;</span> <span style={{ fontSize: '14px' }}>{req.hard_cap}</span>
                  <br />
                  <span style={{ fontSize: '14px', fontWeight: 'bold', width: '160px' }}>Estimate:&nbsp;</span> <span style={{ fontSize: '14px' }}>${req.estimate}</span>
                  <br />

                </Col>
                <Col xs="6" sm="6" md="6" lg="5" >
                  <RequirementComments />
                </Col>
              </Row>
              <Row stye={{ textAlign: 'right' }}>
                <Col>
                  <Button hidden={!this.state.showCompleteButton} className="float-right" color="success" style={{ marginLeft: '5px' }}>Complete</Button>
                  <Button hidden={!this.state.showRequestChangeButton} onClick={() => this.props.showChangeModalFunction(req.uid)} className="float-right">Request Change</Button>
                </Col>
              </Row>
            </Jumbotron>
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default RequirementRow;
