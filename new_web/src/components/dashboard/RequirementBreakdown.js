/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Card,
  CardTitle,
  UncontrolledDropdown,
  CardText,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class RequirementBreakdown extends Component {
  constructor(props) {
    super(props);

    this.setState({


    });
  }

  render() {
    const data = (canvas) => {
      const ctx = canvas.getContext('2d');
      const datasets = [{
        data: [2, 1, 2, 3, 6, 4, 3, 3],
        backgroundColor: ['#7f8c8d', '#3498db', '#16a085', '#bdc3c7', '#2980b9', '#1abc9c', '#c0392b', '#9b59b6', '#f1c40f', '#f39c12', '#e74c3c', '#2c3e50', '#8e44ad', '#27ae60', '#e67e22', '#95a5a6', '#2ecc71', '#d35400', '#34495e'],
        label: 'Dataset 1',
      }];
      const labels = [
        'Requirement 1',
        'Requirement 2',
        'Requirement 3',
        'Requirement 4',
        'Requirement 5',
        'Requirement 6',
        'Requirement 7',
        'Requirement 8',
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
        Requirement Breakdown
          <div className="float-right">
            <UncontrolledDropdown size="sm">
              <DropdownToggle caret className="float-right">
                <i className="fa fa-cog" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Refresh</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardTitle>
        <CardText>
          <Doughnut data={data} />
        </CardText>
      </Card>);
  }
}

export default RequirementBreakdown;
