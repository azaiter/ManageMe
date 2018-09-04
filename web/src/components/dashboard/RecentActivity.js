/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
import { withRouter } from 'react-router-dom';

import {
  Button,
  Card,
  CardTitle,
  UncontrolledDropdown,
  CardText,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
} from 'reactstrap';

import { getRecentActivity } from '../../utils/HttpHelper';

class RecentRequirements extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
    };
  }

  componentDidMount() {
    this.getdata();
  }

  getdata = () => {
    this.setState({ loading: true });
    getRecentActivity(localStorage.getItem('token')).then((res) => {
      const data = res[0];
      const status = res[1];
      if (status == 200) {
        this.setState({
          data,
          loading: false,
        });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  viewProject = (projectId) => {
    this.props.history.push(`/Project/${projectId}`, null);
  }

  render() {
    return (
      <Card color="default" style={{ paddingBottom: '0px' }}>
        <CardTitle className="bg-primary text-white" style={{ marginBottom: '0px' }}>
          Recent Activity
          <div className="float-right">
            <UncontrolledDropdown size="sm">
              <DropdownToggle caret className="float-right">
                <i className="fa fa-cog" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem disabled={this.state.loading} onClick={() => this.getdata()}>Refresh</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardTitle>
        <CardText style={{ paddingBottom: '0px' }}>
          <div className="card-loading-bar">
            <BarLoader id="card-loading-bar" loading={this.state.loading} width="100%" height={5} color="#6D6D6D" />
          </div>
          <Table className="recents-table" style={{ paddingBottom: '0px', marginBottom: '0px' }}>
            <thead />
            <tbody>
              {
            this.state.data.map(data => (
              <tr>
                <td style={{ textAlign: 'left', verticalAlign: 'middle' }}>{data.activity}</td>
              </tr>
              ))
          }
            </tbody>
          </Table>
        </CardText>
      </Card>);
  }
}

export default withRouter(RecentRequirements);
