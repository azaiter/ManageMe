/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';

import {
  Card,
  CardTitle,
  UncontrolledDropdown,
  CardText,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Button,
} from 'reactstrap';

class ProjectComments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    return (
      <Card color="default">
        <CardTitle className="bg-primary text-white">
      Project Comments
        </CardTitle>
        <CardText>
          <Row style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Col>
                None
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <textarea className="form-control" style={{ resize: 'none', height: '100px', marginBottom: '15px' }} />
              <Button color="success" className="float-right">Add Comment</Button>
            </Col>
          </Row>
        </CardText>
      </Card>);
  }
}

export default ProjectComments;
