import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text,
  Icon,
  List,
  ListItem
} from "native-base";
import styles from "./styles";
const Auth = require("../../util/Auth");
class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, { navigate: "Permissions", setUserPermissions: true });
    Auth.getPermissions.bind(this);
  }
  render() {
    return (
      <Container style={styles.container}>
        {this._renderHeader()}
        {this._renderContent()}
      </Container>
    );
  }

  // Render Header
  _renderHeader() {
    return (
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>My Permissions</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => Auth.getPermissions.bind(this)}
            >
              <Icon name="ios-refresh-circle" />
            </Button>
          </Right>
        </Header>
    );
  }

  // Render Content
  _renderContent() {
    return (
        <Content padder>
          <List
            dataArray={Auth.getPermissions(this)}
            renderRow={data =>
              <ListItem>
                <Left>
                  <Text>
                    {data.desc}
                  </Text>
                </Left>
              </ListItem>}
          />
        </Content>
    );
  }
}

export default Permissions;
