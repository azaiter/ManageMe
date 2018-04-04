import React from 'react';
import { createProject, getTeams } from '../../utils/HttpHelper';
import { getLocalToken } from '../../utils/Auth';

class CreateProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      user: '',
      name_error_text: null,
      desc_error_text: null,
      creationError: null,
      disabled: true,
      reqName: '',
      reqTime: '',
      requirements: [{ reqName: '', reqTime: 0 }],
      teamId: this.props.teams[0].uid == null ? null : this.props.teams[0].uid,
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
        name_error_text: 'Please enter a project name',
      });
    }

    if (this.state.desc.length > 0) {
      desc_is_valid = true;
    } else {
      desc_is_valid = false;
      this.setState({
        desc_error_text: 'Please enter a project description',
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

  handleRequirementChange = idx => (evt) => {
    const newRequirements = this.state.requirements.map((requirement, sidx) => {
      if (idx !== sidx) return requirement;
      if (Number.isInteger(parseInt(evt.target.value))) { return { ...requirement, reqTime: evt.target.value }; }
      return { ...requirement, reqName: evt.target.value };
    });

    this.setState({ requirements: newRequirements });
  }

  handleAddRequirement = () => {
    this.setState({
      requirements: this.state.requirements.concat([{ reqName: '', reqTime: 0 }]),
    });
  }

  handleRemoveRequirement = idx => () => {
    this.setState({
      requirements: this.state.requirements.filter((s, sidx) => idx !== sidx),
    });
  }

  changeValue(e, type) {
    const value = e.target.value;
    console.log(value);
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

  handleProjCreation(e) {
    e.preventDefault();

    this.props.updateModalLoading(true);

    const token = getLocalToken();
    if (!(token)) {
      return;
    }
    createProject(token, this.state.name, this.state.desc, this.state.teamId)
      .then((res) => {
        const json = res[0];
        const status = res[1];
        if (status != 200) {
          this.setState({
            creationError: 'Project exists!',
          });
        }
      }).catch((err) => {
        console.log('Error:', err);
      });

    this.props.updateModalLoading(false);

    this.props.toggleModal();

    return false;
  }

  render() {
    function getTheTeams(x) {
      if (x.name) {
        return <option value={x.uid}>{x.name}</option>;
      }
    }

    return (

      <div>
        <div className="form-content">
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Project Name" errortext={this.state.name_error_text} onChange={e => this.changeValue(e, 'name')} />
          </div>
          <div className="form-group">
            <textarea rows="4" className="form-control" placeholder="Project Description" errortext={this.state.desc_error_text} onChange={e => this.changeValue(e, 'desc')} />
          </div>
          <div>
            <select className="form-control" onChange={e => this.changeValue(e, 'teamId')}>
              {this.props.teams.map(team => (<option value={team.uid}>{team.name}</option>))}
            </select>
          </div>
          <p style={{ color: 'red' }}>{this.state.creationError}</p>
        </div>

        <button className="btn btn-success" onClick={e => this.handleProjCreation(e)} disabled={this.state.disabled}>Submit</button>
      </div>

    );
  }
}

export default CreateProject;
