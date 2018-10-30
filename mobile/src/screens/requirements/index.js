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
  Tab,
  Tabs,
  Spinner,
  View,
  Icon,
  Accordion,
} from "native-base";
import { Alert } from "react-native";
import styles from "./styles";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Requirements extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.params = this.props.navigation.state.params;
    Auth.setIsLoginStateOnScreenEntry(this, { setUserPermissions: true });
    Auth.getPermissions.bind(this);
  }

  // Retrieve requirement list from API and assign to state.
  assignRequirementsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.requirementList || opts.refresh)) {
      ApiCalls.getRequirementsByProjectId(this.params.uid).then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            /* 
              1: initial
              2: completed
              3: pending
              4: change request
            */
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
          }
        });
      });
    }
  }

  // Retrieve clocked time from API and assign to state.
  assignTimeToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.clockedTime || opts.refresh)) {
      ApiCalls.getTime().then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            this.setState({
              clockedTime: apiResults,
              renderTime: true
            });
          }
        });
      });
    }
  }

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

  // Time Remaining
  timeRemaining(requirementData, cap) {
    let timeData = [];
    let timeValue = [];
    this.state.clockedTime.forEach(result => {
      if (result.req_uid === requirementData.uid) {
        timeData.push(result);
      }
    });
    timeData.forEach(result => {
      var outTime = new Date(result.out_time);
      var inTime = new Date(result.in_time);
      const time = Math.abs(outTime - inTime) / 36e5;
      timeValue.push(time);
    });
    const totalTime = timeValue.reduce((a, b) => a + b, 0);
    if (cap === "Soft") {
      return this.getTimeFormat(requirementData.soft_cap - totalTime);
    } else {
      return this.getTimeFormat(requirementData.hard_cap - totalTime);
    }
  }

  // Get Time format
  getTimeFormat(data) {
    var hrs = parseInt(Number(data), 10);
    var min = Math.abs(Math.round((Number(data) - hrs) * 60));
    return hrs + ":" + min;
  }

  // Get Buttons
  getButtons(requirementData) {
    if (requirementData.status === 1) {
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
    } else if (requirementData.status === 3) {
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
      return (<View style={styles.requirementActivityView} />
      );
    }
  }

  // Get Requirement Data
  getRequirementDetails(requirementData) {
    if (requirementData.status === 2) {
      return (
        <View />
      );
    }
    else {
      return (
        <View>
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
          {this.getTimeRemaining(requirementData)}
        </View>
      );
    }
  }

// Get Time Remiaining Data
  getTimeRemaining(requirementData) {
    if (requirementData.status === 1) {
      return (
        <View style={styles.requirementDataFlex}>
            <View>
              <Text style={styles.requirementDetails}>Time for Soft Cap</Text>
              <Text style={styles.requirementDetails}>Time for Hard Cap</Text>
            </View>
            <View>
              <Text style={styles.requirementDetails}>{this.timeRemaining(requirementData, "Soft")}{" "}</Text>
              <Text style={styles.requirementDetails}>{this.timeRemaining(requirementData, "Hard")}{" "}</Text>
            </View>
          </View>
      );
    }
    else {
      return (
        <View />
      );
    }
  }

  // Render
  render() {
    this.assignRequirementsToState();
    this.assignTimeToState();
    return (
      <Container style={styles.container}>
        {this._renderHeader()}
        {this._renderTabs()}
      </Container>
    );
  }

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
        <Left>
          <Button
            transparent
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="ios-arrow-dropleft-circle" />
          </Button>
        </Left>
        <Body>
          <Title>Requirements</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => {
              this.assignRequirementsToState({ refresh: true });
              this.assignTimeToState({ refresh: true });
            }}
          >
            <Icon name="ios-refresh-circle" />
          </Button>
        </Right>
      </Header>
    );
  }

  // Render Tabs
  _renderTabs() {
    if (this.state.renderRequirement && this.state.renderTime) {
      return (
        <Tabs initialPage={this.params.initialPage}>
          <Tab
            heading="Active"
          >
            <Content padder>
              <Accordion
                dataArray={this.state.requirementList.initial}
                renderHeader={this._renderAccordionHeader}
                renderContent={this._renderAccordionContent}
              />
            </Content>
          </Tab>
          <Tab
            heading="Pending"
          >
            <Content padder>
              <Accordion
                dataArray={this.state.requirementList.pending}
                renderHeader={this._renderAccordionHeader}
                renderContent={this._renderAccordionContent}
              />
            </Content>
          </Tab>
          <Tab
            heading="Completed"
          >
            <Content padder>
              <Accordion
                dataArray={this.state.requirementList.completed}
                renderHeader={this._renderAccordionHeader}
                renderContent={this._renderAccordionContent}
              />
            </Content>
          </Tab>
        </Tabs>
      );
    } else {
      return this._renderLoadingScreen();
    }
  }

  // Render Accordion Header
  _renderAccordionHeader = (requirementData, expanded) => {
    return (
      <View style={styles.accordionHeaderView}>
        <Text style={styles.requirementDataTitle}>{requirementData.name}</Text>
        {expanded
          ? <Icon style={styles.expandedIconStyle} name="remove-circle" />
          : <Icon style={styles.iconStyle} name="add-circle" />}
      </View>
    );
  }

  // Render Accordion Content
  _renderAccordionContent = (requirementData) => {
    return (
      <View style={styles.accordionContentView}>
        <View>
          <Text style={styles.requirementDataDesc}>{requirementData.desc}</Text>
          <View style={styles.flex}>
            <Icon style={styles.requirementDataTime} name="time" />
            <Text style={styles.requirementDataTime}>{"  "}{requirementData.created}</Text>
          </View>
        </View>
        {this.getRequirementDetails(requirementData)}
        {this.getButtons(requirementData)}
      </View>
    );
  }
}

export default Requirements;
