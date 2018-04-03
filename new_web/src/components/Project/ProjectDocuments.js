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

class ProjectDocuments extends Component {
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
      Project Documents
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
              <Button color="primary" className="float-right">Select Files To Upload</Button>
            </Col>
          </Row>
        </CardText>
      </Card>);
  }
}

export default ProjectDocuments;
