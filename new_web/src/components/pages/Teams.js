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
      comp: <MyTeams show />,
    };
  }

  refresh = () => {
    window.location.reload();
  }

  render() {
    return (
      <div>
        <ToolBar className="float-right" refresh={this.refresh} />
        {this.state.comp}
      </div>
    );
  }
}

export default withRouter(Teams);
