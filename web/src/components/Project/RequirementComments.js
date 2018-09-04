/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
import { getReqComments, addReqComment } from '../../utils/HttpHelper';
import { getLocalToken } from '../../utils/Auth';

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

class RequirementComments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      reqComments: [],
      comment: '',
    };
  }

  componentDidMount() {
    this.getReqComments();
  }

  getReqComments = () => {
    getReqComments(getLocalToken(), this.props.reqID).then((res) => {
      const json = res[0];
      const status = res[1];
      if (status !== 200) {
        return;
      }
      this.setState({
        reqComments: json.reverse(),
      });
    });
  }

  addReqComment = () => {
    addReqComment(getLocalToken(), this.props.reqID, this.state.comment).then((res) => {
      const json = res[0];
      const status = res[1];
      if (status !== 200) {
        return;
      }
      this.setState({ comment: '' });
      this.getReqComments();
    });
  }

  render() {
    return (
      <Card color="default">
        <CardTitle className="bg-primary text-white">
          Requirement Comments
        </CardTitle>
        <CardText>
          <Row style={{ maxHeight: '500px', overflowY: 'auto', marginRight: '0px' }}>
            <Col>
              {
                  this.state.reqComments.map(comment => (
                    <div>
                      <b>{comment.fullName}:&nbsp;</b>{comment.entered}
                      <br />
                      {comment.comment}
                      <br />
                      <br />
                    </div>))
                }
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <textarea className="form-control" value={this.state.comment} onChange={(e) => { this.setState({ comment: e.target.value }); }} style={{ resize: 'none', height: '100px', marginBottom: '15px' }} />
              <Button color="primary" disabled={this.state.comment.length == 0} className="float-right" onClick={() => this.addReqComment()} >Add Comment</Button>
            </Col>
          </Row>
        </CardText>
      </Card>);
  }
}

export default RequirementComments;
