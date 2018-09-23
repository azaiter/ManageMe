import React, { Component } from "react";
import {
    Container,
    Header,
    Title,
    Tabs,
    Button,
    Tab,
    Content,
    Body,
    Left,
    Right,
    Icon,
    View,
    Text,
    List
} from "native-base";
import styles from "./styles";
const ApiCalls = require("../../util/ApiCalls");
const Auth = require("../../util/Auth");

class ProjectInfo extends Component {

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
            <Title>Project Info</Title>
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
export default ProjectInfo;
