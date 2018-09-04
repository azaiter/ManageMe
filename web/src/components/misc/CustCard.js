/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
} from 'reactstrap';

const CustCard = props => (
  <Card className="top-card" outline color={props.color ? props.color : 'primary'}>
    <CardTitle style={{ marginBottom: '0px' }} className="bg-primary text-white card-just-header">
      <Row>
        <Col xs="3">
          <i className={`fa ${props.icon ? props.icon : 'fa-info'} fa-4x`} />
        </Col>
        <Col xs="9" className="text-right">
          <div className="huge">{props.data}</div>
          <div>{props.title}</div>
        </Col>
      </Row>
    </CardTitle>
  </Card>
);


export default CustCard;
