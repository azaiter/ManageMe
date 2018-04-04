import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { getLocalToken } from '../../utils/Auth';
import RecentProjects from '../dashboard/RecentProjects';
import RecentRequirements from '../dashboard/RecentRequirements';
import { getTeams } from '../../utils/HttpHelper';
import MyTeams from '../teams/MyTeams';
import ToolBar from '../projects/ToolBar';

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      work: [],
    };
  }

  refresh = () => {
    this.setState({
      work: 'asdf',
    });
  }

  render() {
    return (
      <div>
        <ToolBar refresh={e => this.refresh()} />
        <MyTeams work={this.state.work} show />

      </div>
    );
  }
}

export default withRouter(Teams);
