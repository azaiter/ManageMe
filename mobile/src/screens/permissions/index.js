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
  constructor(props){
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {navigate:"Permissions", setUserPermissions: true});
    Auth.getPermissions.bind(this);
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>My Permissions</Title>
          </Body>
          <Right />
        </Header>

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
          <Button onPress={() => this.props.navigation.goBack()}>
            <Text>Back</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default Permissions;
