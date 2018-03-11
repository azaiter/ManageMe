/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Card,
  CardTitle,
  UncontrolledDropdown,
  CardText,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { BarLoader } from 'react-spinners';

class ProjectBreakdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    const data = (canvas) => {
      const ctx = canvas.getContext('2d');
      const datasets = [{
        data: [2, 1, 3, 4],
        backgroundColor: ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'],
        label: 'Dataset 1',
      }];
      const labels = [
        'Project 1',
        'Project 2',
        'Project 3',
        'Project 4',
      ];

      return {
        label: 'Hours Breakdown',
        labels,
        datasets,
      };
    };

    return (
      <Card color="default">
        <CardTitle className="bg-primary text-white">
      Project Breakdown
          <div className="float-right">
            <UncontrolledDropdown size="sm">
              <DropdownToggle caret className="float-right">
                <i className="fa fa-cog" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem disabled={this.state.loading}>Refresh</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardTitle>
        <CardText>
          <div className="card-loading-bar">
            <BarLoader id="card-loading-bar" loading={this.state.loading} width="100%" height={5} color="#6D6D6D" />
          </div>
          <Pie data={data} />
        </CardText>
      </Card>);
  }
}

export default ProjectBreakdown;

