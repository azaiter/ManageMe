import React from 'react';
import {
  Card,
  Button, CardHeader,
  CardBody, CardText,
} from 'reactstrap';
import ReactCardFlip from 'react-card-flip';
import { withRouter } from 'react-router-dom';
import { login, userIsLoggedIn } from '../../utils/Auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ isFlipped: !this.state.isFlipped });
  }

  render() {
    return (
      <div id="loginCard">
        <ReactCardFlip isFlipped={this.state.isFlipped}>
          <Card key="front">
            <CardHeader className="bg-primary text-white">Login</CardHeader>
            <CardBody>
              <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
              <Button onClick={this.handleClick}>Go somewhere</Button>
            </CardBody>
          </Card>
          <Card key="back">
            <CardHeader className="bg-primary text-white">Signup</CardHeader>
            <CardBody>
              <CardText>
              With supporting text below as a natural lead-in to additional content.
              With supporting text below as a natural lead-in to additional content.
              With supporting text below as a natural lead-in to additional content.
              With supporting text below as a natural lead-in to additional content.
              With supporting text below as a natural lead-in to additional content.
              With supporting text below as a natural lead-in to additional content.
              With supporting text below as a natural lead-in to additional content.
              With supporting text below as a natural lead-in to additional content.
              With supporting text below as a natural lead-in to additional content.
              </CardText>
              <Button onClick={this.handleClick}>Go somewhere</Button>
            </CardBody>
          </Card>
        </ReactCardFlip>
      </div>
    );
  }
}

export default withRouter(Login);
