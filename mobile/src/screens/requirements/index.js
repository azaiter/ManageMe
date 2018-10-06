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
<<<<<<< HEAD
  Tab,
  Tabs,
  Spinner,
  View,
  Icon,
} from "native-base";
import { FlatList, Alert } from "react-native";
=======
  Icon,
  Tab,
  Tabs,
} from "native-base";
import { TouchableOpacity, FlatList } from "react-native";
>>>>>>> cdb18b1f48d63476f2429cfff19b3f43e96b738f
import styles from "./styles";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Requirements extends Component {
  constructor(props) {
    super(props);
<<<<<<< HEAD
    this.state = {};
    this.params = this.props.navigation.state.params;
    Auth.setIsLoginStateOnScreenEntry(this, { setUserPermissions: true });
    Auth.getPermissions.bind(this);
    //this._renderAccordionContentActive.bind(this);
    this._renderTabs.bind(this);
  }

  // Retrieve requirement list from API and assign to state.
  assignRequirementsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.requirementList || opts.refresh)) {
      ApiCalls.getRequirementsByProjectId(this.params.project.uid).then(response => {
=======
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
>>>>>>> cdb18b1f48d63476f2429cfff19b3f43e96b738f
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            /* 
              1: initial
              2: completed
              3: pending
              4: change request
            */
<<<<<<< HEAD
            let requirementList = {};
            requirementList.initial = [];
            requirementList.completed = [];
            requirementList.pending = [];
            requirementList.changeRequest = [];
            apiResults.forEach(result => {
              if (result.status === 1) {
                requirementList.initial.push(result);
              }
              if (result.status === 2) {
                requirementList.completed.push(result);
              }
              if (result.status === 3) {
                requirementList.pending.push(result);
              }
              if (result.status === 4) {
                requirementList.changeRequest.push(result);
              }
            });
            this.setState({
              requirementList,
              renderRequirement: true
            });
=======
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
>>>>>>> cdb18b1f48d63476f2429cfff19b3f43e96b738f
          }
        });
      });
    }
  }

<<<<<<< HEAD
  //Handle Submit
  handleSubmit = async (requirementData) => {
    if (requirementData.clocked_in === "Y") {
      ApiCalls.clockOut(requirementData.uid).then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            let message = `Requirement "${requirementData.name}" was successfully Clocked Out!`;
            ApiCalls.showToastsInArr([message], {
              buttonText: "OK",
              type: "success",
              position: "top",
              duration: 10 * 1000
            });
            Alert.alert(
              "Requirement is Clocked Out!",
              message,
              [
                {
                  text: "OK", onPress: () => {
                    this.assignRequirementsToState({ refresh: true });
                  }
                },
              ]
            );
          }
        });
      });
    } else {
      ApiCalls.clockIn(requirementData.uid).then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            let message = `Requirement "${requirementData.name}" was successfully Clocked In!`;
            ApiCalls.showToastsInArr([message], {
              buttonText: "OK",
              type: "success",
              position: "top",
              duration: 10 * 1000
            });
            Alert.alert(
              "Requirement is Clocked in!",
              message,
              [
                {
                  text: "OK", onPress: () => {
                    this.assignRequirementsToState({ refresh: true });
                  }
                },
              ]
            );
          }
        });
      });
    }
  }

  // Clock in text
  clockInText(clocked_in) {
    if (clocked_in === "Y") {
      return "Clock Out";
    } else {
      return "Clock In";
    }
  }

  // Get Buttons
  getButtons(status, requirementData) {
    if (status === "initial") {
      return (
        <View style={styles.requirementActivityView}>
          <Button style={styles.button} rounded primary onPress={() => this.handleSubmit(requirementData)}>
            <Text style={styles.requirementActivity}>{this.clockInText(requirementData.clocked_in)}</Text>
          </Button>
          <Button style={styles.button} rounded primary>
            <Text style={styles.requirementActivity}>Change</Text>
          </Button>
        </View>
      );
    } else if (status === "pending") {
      return (
        <View style={styles.requirementActivityView}>
          <Button style={styles.button} rounded primary>
            <Text style={styles.requirementActivity}>Change</Text>
          </Button>
          <Button style={styles.button} rounded primary>
            <Text style={styles.requirementActivity}>Accept</Text>
          </Button>
          <Button style={styles.button} rounded primary>
            <Text style={styles.requirementActivity}>Reject</Text>
          </Button>
        </View>
      );
    } else {
      return (<View style={styles.requirementActivityView}>
        <Button style={styles.button} transparent/>
      </View>
      );
    }
  }

  // Render
  render() {
    this.assignRequirementsToState();
    return (
      <Container style={styles.container}>
        {this._renderHeader()}
        {this._renderTabs()}
=======
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
>>>>>>> cdb18b1f48d63476f2429cfff19b3f43e96b738f
      </Container>
    );
  }

<<<<<<< HEAD
  // Render loading screen
  _renderLoadingScreen() {
    return (
      <Content padder>
        <Spinner color="blue" />
      </Content>
    );
  }

  // Render Header
  _renderHeader() {
    return (
      <Header hasTabs>
=======
  _renderHeader() {
    return (
      <Header>
>>>>>>> cdb18b1f48d63476f2429cfff19b3f43e96b738f
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
<<<<<<< HEAD
            transparent
=======
>>>>>>> cdb18b1f48d63476f2429cfff19b3f43e96b738f
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="arrow-back" />
          </Button>
        </Right>
      </Header>
    );
  }

<<<<<<< HEAD
  // Render Tabs
  _renderTabs() {
    if (this.state.renderRequirement) {
      return (
        <Tabs initialPage={this.params.initialPage}>
          <Tab
            heading="Active"
          >
            <Content padder>
              <FlatList
                style={styles.container}
                data={this.state.requirementList.initial}
                renderItem={data => this._renderRequirementData(data.item, "initial")}
                keyExtractor={item => item.uid.toString()}
              />
            </Content>
          </Tab>
          <Tab
            heading="Pending"
          >
            <Content padder>
              <FlatList
                style={styles.container}
                data={this.state.requirementList.pending}
                renderItem={data => this._renderRequirementData(data.item, "pending")}
                keyExtractor={item => item.uid.toString()}
              />
            </Content>
          </Tab>
          <Tab
            heading="Completed"
          >
            <Content padder>
              <FlatList
                style={styles.container}
                data={this.state.requirementList.completed}
                renderItem={data => this._renderRequirementData(data.item, "completed")}
                keyExtractor={item => item.uid.toString()}
              />
            </Content>
          </Tab>
        </Tabs>
      );
    } else {
      return this._renderLoadingScreen();
    }
  }

  // Render Requirement Data
  _renderRequirementData(requirementData, status) {
    return (
      <View style={styles.requirementItem}>
        <View>
          <Text style={styles.requirementDataTitle}>{requirementData.name}</Text>
        </View>
        <View>
          <Text style={styles.requirementDataDesc}>{requirementData.desc}</Text>
          <View style={styles.flex}>
            <Icon style={styles.requirementDataTime} name="time" />
            <Text style={styles.requirementDataTime}>{"  "}{requirementData.created}</Text>
          </View>
        </View>
        <View style={styles.requirementDataFlex}>
          <View>
            <Text style={styles.requirementDetails}>Soft Cap</Text>
            <Text style={styles.requirementDetails}>Hard Cap</Text>
            <Text style={styles.requirementDetails}>Estimate</Text>
            <Text style={styles.requirementDetails}>Priority</Text>
          </View>
          <View>
            <Text style={styles.requirementDetails}>{requirementData.soft_cap}{" "}{"hours"}</Text>
            <Text style={styles.requirementDetails}>{requirementData.hard_cap}{" "}{"hours"}</Text>
            <Text style={styles.requirementDetails}>{requirementData.estimate}{" "}{"units"}</Text>
            <Text style={styles.requirementDetails}>{requirementData.priority}{" "}{" "}</Text>
          </View>
        </View>
        {this.getButtons(status, requirementData)}
      </View>
=======
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
>>>>>>> cdb18b1f48d63476f2429cfff19b3f43e96b738f
    );
  }
}

export default Requirements;
