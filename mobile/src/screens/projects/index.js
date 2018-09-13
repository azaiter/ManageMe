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
  Text
} from "native-base";
import styles from "./styles";
const Auth = require("../../util/Auth");
class Projects extends Component {
  constructor(props){
    super(props);
    Auth.setIsLoginStateOnScreenEntry(this, {navigate:"Projects"});
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left />
          <Body>
            <Title>Projects</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Button onPress={() => this.props.navigation.goBack()}>
            <Text>Back</Text>
          </Button>
          <Button onPress={() => alert("This is Card Header")}> 
            <Text>Click Me ... </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default Projects;
