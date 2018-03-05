import React from 'react';
import {
  Card,
  Button, CardHeader,
  CardBody, CardText,
} from 'reactstrap';
import FlipCard from 'react-flipcard-2';
import { withRouter } from 'react-router-dom';
import { login, userIsLoggedIn } from '../../utils/Auth';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFlipped: false,
    };
  }

  showBack() {
    this.setState({
      isFlipped: true,
    });
  }

  showFront() {
    this.setState({
      isFlipped: false,
    });
  }

  render() {
    return (
      <div id="loginCard">
        <FlipCard disabled flipped={this.state.isFlipped}>
          <div>
            <Card >
              <CardHeader className="bg-primary text-white">Login</CardHeader>
              <CardBody>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Button onClick={() => this.showBack()}>Go somewhere</Button>
              </CardBody>
            </Card>
          </div>
          <div>
            <Card >
              <CardHeader className="bg-primary text-white">Signup</CardHeader>
              <CardBody>
                <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                <Button onClick={() => this.showFront()}>Go somewhere</Button>
              </CardBody>
            </Card>
          </div>
        </FlipCard>
      </div>
    );
  }
}

export default withRouter(Login);
