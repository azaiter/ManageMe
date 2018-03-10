/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import {
  Card,
  CardTitle,
  UncontrolledDropdown,
  CardText,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class HoursBreakdown extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = (canvas) => {
      const ctx = canvas.getContext('2d');
      const colors = ['#7f8c8d', '#3498db', '#16a085', '#bdc3c7', '#2980b9', '#1abc9c', '#c0392b', '#9b59b6', '#f1c40f', '#f39c12', '#e74c3c', '#2c3e50', '#8e44ad', '#27ae60', '#e67e22', '#95a5a6', '#2ecc71', '#d35400', '#34495e'];
      const datasets = [{
        label: 'Requirement 1',
        borderColor: colors[0],
        fill: false,
        data: [
          1,
          6,
          3,
          1,
          5,
          2,
          7,
        ],
      },
      {
        label: 'Requirement 2',
        borderColor: colors[1],
        fill: false,
        data: [
          0,
          6,
          1,
          4,
          2,
          2,
          6,
        ],
      },
      {
        label: 'Requirement 2',
        borderColor: colors[2],
        fill: false,
        data: [
          3,
          4,
          5,
          6,
          2,
          1,
          0,
        ],
      }];
      const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return {
        label: 'Hours Breakdown',
        labels,
        datasets,
      };
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    };

    return (
      <Card color="default">
        <CardTitle className="bg-primary text-white">
        Hours Breakdown
          <div className="float-right">
            <UncontrolledDropdown size="sm">
              <DropdownToggle caret className="float-right">
                <i className="fa fa-cog" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Refresh</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Cumulative</DropdownItem>
                <DropdownItem>Requirments</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardTitle>
        <CardText>
          <Line data={data} options={options} />
        </CardText>
      </Card>);
  }
}

export default HoursBreakdown;
