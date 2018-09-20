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
import { TabNavigator, TabBarBottom } from 'react-navigation';
import styles from "./styles";
const ApiCalls = require("../../util/ApiCalls");
const Auth = require("../../util/Auth");

class Requirements extends React.Component {
    constructor(props) {
        super(props);
        Auth.setIsLoginStateOnScreenEntry(this, { navigate: "Requirements" });
    }
    render() {
        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Projects</Title>
                    </Body>
                    <Right />
                </Header>

                <Content padder />



            </Container>
        );
    }
}
export default Requirements;