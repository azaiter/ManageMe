import React from 'react';
import CreateTeam from '../forms/CreateTeam';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class ToolBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teamShow: false,
    };
  }


  handleClose = (form) => {
    switch (form) {
      case 'team':
        this.setState({ teamShow: false });
        this.props.refresh();
        break;
      default:
        break;
    }
  }

  handleShow = (form) => {
    switch (form) {
      case 'team':
        this.setState({ teamShow: true });
        break;
      default:
        break;
    }
  }

  render() {
  	return (
    <div>
      <button className="pull-right btn btn-primary btn-outline btn-rounded" onClick={e => this.handleShow('team')}>Create Team</button>
      <Modal isOpen={this.state.teamShow} onHide={e => this.handleClose('team')}>
        <ModalHeader closeButton>
          Create Team
        </ModalHeader>
        <ModalBody>
          <CreateTeam close={e => this.handleClose('team')} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={e => this.handleClose('team')}>Close</Button>
        </ModalFooter>
      </Modal>

    </div>

    );
  }
}

export default ToolBar;
