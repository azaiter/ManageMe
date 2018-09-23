import React, { Component } from "react";
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Footer,
    FooterTab,
    Left,
    Right,
    Body,
    Text,
    FlatList,
    View,
    Icon
} from "native-base";
import styles from "./styles";
const ApiCalls = require("../../util/ApiCalls");
const Auth = require("../../util/Auth");

class Requirements extends React.Component {
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
            <Title>Requirements</Title>
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
export default Requirements;