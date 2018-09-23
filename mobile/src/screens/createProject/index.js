import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text,
  List,
  Picker
} from "native-base";
import styles from "./styles";

class CreateProject extends Component {
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
          <Title>CreateProject</Title>
        </Body>
        <Right />
      </Header>

      <Content padder>
        <Button onPress={() => this.props.navigation.goBack()}>
          <Text>Back</Text>
        </Button>
      </Content>
    </Container>
      );
  }
}
export default CreateProject;
