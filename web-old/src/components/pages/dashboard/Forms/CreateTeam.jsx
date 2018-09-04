import React from 'react';
import Router, { Link, RouteHandler } from 'react-router';
import { Panel, Input, Button } from 'react-bootstrap';
import { History } from 'history';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';
import { createTeam } from '../../../../utils/HttpHelper';
import { getLocalToken } from '../../../../actions/Auth';

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      name_error_text: null,
      desc_error_text: null,
      creationError: null,
      disabled: true,
    };
  }

  isDisabled() {
    let name_is_valid = false;
    let desc_is_valid = false;

    if (this.state.name.length > 0) {
      name_is_valid = true;
    } else {
      name_is_valid = false;
      this.setState({
        name_error: 'Please enter a team name',
      });
    }

    if (this.state.desc.length > 0) {
      desc_is_valid = true;
    } else {
      desc_is_valid = false;
      this.setState({
        desc_error_text: 'Please enter a desc',
      });
    }

    if (name_is_valid && desc_is_valid) {
      this.setState({
        disabled: false,
      });
    } else {
      this.setState({
        disabled: true,
      });
    }
  }

  changeValue(e, type) {
    const value = e.target.value;
    const next_state = {};
    next_state[type] = value;
    this.setState(next_state, () => {
      this.isDisabled();
    });
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.handleLogin(e);
      }
    }
  }

  handleTeamCreation(e) {
    e.preventDefault();
    const token = getLocalToken();
    if (!(token)) {
      return;
    }
    createTeam(token, this.state.name, this.state.desc)
      .then((res) => {
        const json = res[0];
        const status = res[1];
        if (status != 200) {
          this.setState({
            creationError: 'Team exists!',
          });
          return;
        }
        window.location.reload();
      }).catch((err) => {
        console.log('Error:', err);
      });

    return false;
  }


  render() {
    return (
      <div>
        <form role="form" onSubmit={this.handleTeamCreation.bind(this)} className="ng-pristine ng-valid">
          <div className="form-content">
            <div className="form-group">
              <input className="form-control" placeholder="Team Name" errorText={this.state.name_error_text} onChange={e => this.changeValue(e, 'name')} />
            </div>
            <div className="form-group">
              <textarea rows="4" className="form-control" placeholder="Description" errorText={this.state.desc_error_text} onChange={e => this.changeValue(e, 'desc')} />
            </div>
            <p style={{ color: 'red' }}>{this.state.creationError}</p>
          </div>
          <Button bsStyle="success" onClick={e => this.handleTeamCreation(e)} disabled={this.state.disabled}>Submit</Button>
        </form>
      </div>
    );
  }
}

export default CreateTeam;
