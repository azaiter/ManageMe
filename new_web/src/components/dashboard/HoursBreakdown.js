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
      const datasets = [{
        label: 'Requirement 1',
        borderColor: '#4286f4',
        backgroundColor: '#4286f4',
        fill: false,
        data: [
          1,
          0,
          3,
          0,
          5,
          0,
          7,
        ],
      }, {
        label: 'Requirement 2',
        borderColor: '#7a7a7a',
        backgroundColor: '#7a7a7a',
        fill: false,
        data: [
          0,
          6,
          0,
          4,
          0,
          2,
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
