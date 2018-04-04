/* eslint react/no-did-mount-set-state: 0 */
import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { BarLoader } from 'react-spinners';
import { getWeeklyHours, getUserInfoByUserId } from '../../utils/HttpHelper';
import { getLocalToken, getLocalUid } from '../../utils/Auth';

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

    this.state = {
      loading: false,
      hours: [],
      name: '',
    };
    getUserInfoByUserId(getLocalToken(), getLocalUid()).then((res) => {
      this.setState({
        name: res[0][0].first_name,
      });
    });
    getWeeklyHours(getLocalToken()).then((res) => {
      const json = res[0];
      const status = res[1];
      if (status !== 200) {
        return;
      }
      const data = Object.values(json[0]).map((i) => { if (!i) { return 0; } return i; });
      this.setState({
        hours: data,
      });
    });
  }

  render() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday', 'Sunday'];
    const goBackDays = 7;

    const today = new Date();
    const daysSorted = [];

    for (let i = 0; i < goBackDays; i++) {
      const newDate = new Date(today.setDate(today.getDate() - 2));
      daysSorted.push(days[newDate.getDay()]);
    }
    daysSorted.reverse();

    const data = (canvas) => {
      const ctx = canvas.getContext('2d');
      const colors = ['#7f8c8d', '#3498db', '#16a085', '#bdc3c7', '#2980b9', '#1abc9c', '#c0392b', '#9b59b6', '#f1c40f', '#f39c12', '#e74c3c', '#2c3e50', '#8e44ad', '#27ae60', '#e67e22', '#95a5a6', '#2ecc71', '#d35400', '#34495e'];
      const datasets = [{
        label: `${this.state.name}'s Hours`,
        borderColor: colors[Math.floor(Math.random() * colors.length) + 0],
        fill: false,
        data: this.state.hours,
      }];
      const labels = daysSorted;
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
        </CardTitle>
        <CardText>
          <div className="card-loading-bar">
            <BarLoader id="card-loading-bar" loading={this.state.loading} width="100%" height={5} color="#6D6D6D" />
          </div>
          <Line data={data} options={options} />
        </CardText>
      </Card>);
  }
}

export default HoursBreakdown;
