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
    this.getPermissions.bind(this);
  }
  getPermissions(){
    if (this.state && this.state.userPermissions){
      return this.state.userPermissions;
    }
    else {
      return [];
    }
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
            dataArray={this.getPermissions()}
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
