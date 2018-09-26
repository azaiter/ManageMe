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
  Tab,
  Tabs,
} from "native-base";
import { TouchableOpacity, FlatList } from "react-native";
import styles from "./styles";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Requirements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      projectDesc: "",
      teamId: ""
    };
    Auth.setIsLoginStateOnScreenEntry(this, { setUserPermissions: true });
    Auth.getPermissions.bind(this);
  }

  // Retrieve requirement list from API and assign to state.
  assignRequirementsToState(projectId, opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.reqList || opts.refresh)) {
      ApiCalls.getRequirementsByProjectId(projectId).then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            /* 
              1: initial
              2: completed
              3: pending
              4: change request
            */
            let reqList = {};
            reqList.initial = [];
            reqList.completed = [];
            reqList.pending = [];
            reqList.changeRequest = [];
            apiResults.forEach(result => {
              if (result.status === 1) {
                reqList.initial.push(result);
              }
              if (result.status === 2) {
                reqList.completed.push(result);
              }
              if (result.status === 3) {
                reqList.pending.push(result);
              }
              if (result.status === 4) {
                reqList.changeRequest.push(result);
              }
            });
            this.setState({ reqList });
          }
        });
      });
    }
  }

  /* TODO: remove this comment
    example requirement object
    Object {
      "accepted_by": 0,
      "changed": null,
      "clocked_in": "N",
      "created": "Wed, 25 Apr 2018 10:35:50 GMT",
      "created_by": 95,
      "desc": "Just do it please.",
      "estimate": 5,
      "first_name": "Zack",
      "hard_cap": 30,
      "last_name": "Zaiter",
      "name": "Make The Fox Blue",
      "notes": null,
      "priority": 1,
      "soft_cap": 20,
      "status": 2,
      "uid": 66,
    },
  */

  render() {
    this.assignRequirementsToState(this.props.navigation.state.params.projectId);
    if (this.state.render) {
      return (
        <Container style={styles.container}> 
          {this._renderHeader()}
          {this._renderBody()}
        </Container>
      );
    } else {
      return this._renderLoadingScreen();
    }
  }

  _renderLoadingScreen() {
    return (
      <Container style={styles.container}>
        <Content padder>
          <Text>
            Loading...
          </Text>
        </Content>
      </Container>
    );
  }

  _renderHeader() {
    return (
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
        <Right>
          <Button
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
        </Right>
      </Header>
    );
  }

  _renderBody() {
    return (
      <Tabs>
        <Tab heading="Active">
          <Content padder>
            <Text>ONE</Text>
          </Content>
        </Tab>
        <Tab heading="Pending">
          <Content padder>
            <Text>TWO</Text>
          </Content>
        </Tab>
        <Tab heading="Completed">
          <Content padder>
            <Text>THREE</Text>
          </Content>
        </Tab>
      </Tabs>
    );
  }

  _renderListActive() {
    return (
      <Content padder>
        <Text>ACTIVE</Text>
      </Content>
    );
  }

  _renderListPending() {
    return (
      <Content padder>
        <Text>PENDING</Text>
      </Content>
    );
  }

  _renderListCompleted() {
    return (
      <Content padder>
        <Text>COMPLETED</Text>
      </Content>
    );
  }
}

export default Requirements;
