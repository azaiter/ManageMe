/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';

import {
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
  FormGroup,
  Input,
  FormText, Button,
} from 'reactstrap';

class ProjectDocuments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  uploadFile = () => {
    const file = document.getElementById('uploadFile').files[0];
    const read = new FileReader();

    read.readAsBinaryString(file);

    read.onloadend = function () {
      console.log(read.result);
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
              <FormGroup>
                <Input type="file" name="file" id="uploadFile" />
                <FormText color="muted">
                Please select a file to add to the project.
                </FormText>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button color="success" className="float-right" onClick={() => this.uploadFile()}>Upload</Button>
            </Col>
          </Row>
        </CardText>
      </Card>);
  }
}

export default ProjectDocuments;
