import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
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
import { ManageMe_Header } from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");
const HandleError = require("../../util/HandleError");

class Requirements extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
    this.params = this.props.navigation.state.params;
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "Requirements",
      setUserPermissions: true
    });
    this.assignRequirementsToState();
    this.assignTimeToState();
    Auth.userHasPermission.bind(this);
    this.getRenderFromState.bind(this);
    this.handleSubmit.bind(this);
    this.getRequirementDetails.bind(this);
    this.getButtons.bind(this);
    this.getTimeRemaining.bind(this);
    this.clockInText.bind(this);
    this.timeRemaining.bind(this);
    this.getTimeFormat.bind(this);
    this._renderTabs.bind(this);
    this._renderLoadingScreen.bind(this);
    this._renderAccordionHeader.bind(this);
    this._renderAccordionContent.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
    this.assignRequirementsToState({ refresh: true });
    this.assignTimeToState({ refresh: true });
  });

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Retrieve requirement list from API and assign to state.
  assignRequirementsToState(opts = { refresh: false }) {
    if ((this.state && this._isMounted) && (!this.state.requirementList || opts.refresh)) {
      ApiCalls.getRequirementsByProjectId({ projectId: this.params.uid }).then(apiResults => {
        let requirementList = {};
        requirementList.initial = [];
        requirementList.completed = [];
        requirementList.pending = [];
        requirementList.changeRequest = [];
        /*
        1: initial
        2: completed
        3: pending
        4: change request
        */
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
          requirementList
        });
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert("Error!",
          JSON.stringify(this.state.ApiErrors || this.state.Errors),
          (this.state.ApiErrors ? null :
            [{
              text: "OK", onPress: () => {
                this.assignRequirementsToState({ refresh: true });
              }
            }]
          )
        );
      });
    }
  }

  // Retrieve clocked time from API and assign to state.
  assignTimeToState(opts = { refresh: false }) {
    if ((this.state && this._isMounted) && (!this.state.clockedTime || opts.refresh)) {
      ApiCalls.getTime().then(apiResults => {
        this.setState({
          clockedTime: apiResults
        });
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert("Error!",
          JSON.stringify(this.state.ApiErrors || this.state.Errors),
          (this.state.ApiErrors ? null :
            [{
              text: "OK", onPress: () => {
                this.assignTimeToState({ refresh: true });
              }
            }]
          )
        );
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if ((this.state.requirementList && this.state.clockedTime && this.state) || (this.state && this.state.ApiErrors)) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit_Complete = async (requirementData) => {
    if (this._isMounted) {
      ApiCalls.completeReq({ req: requirementData.uid }).then(apiResults => {
        let message = `Requirement "${requirementData.name}" was Completed successfully!`;
        HandleError.showToastsInArr([message], {
          type: "success",
          duration: 10000
        });
        Alert.alert("Requirement Completed!",
          message, [{
            text: "OK", onPress: () => {
              this.assignRequirementsToState({ refresh: true });
            }
          }]
        );
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert("Requirement not Completed!",
          JSON.stringify(this.state.ApiErrors || this.state.Errors),
          (this.state.ApiErrors ? null :
            [{
              text: "OK", onPress: () => {
                this.assignRequirementsToState({ refresh: true });
              }
            }]
          )
        );
      });
    }
  }

  //Handle Submit
  handleSubmit = async (requirementData) => {
    let functionToExec = requirementData.clocked_in === "Y" ? ApiCalls.clockOut : ApiCalls.clockIn;
    let action = requirementData.clocked_in === "Y" ? "Clocked Out" : "Clocked In";
    if (this._isMounted) {
      functionToExec({ reqID: requirementData.uid }).then(apiResults => {
        let message = `Requirement "${requirementData.name}" was successfully "${action}"!`;
        HandleError.showToastsInArr([message], {
          type: "success",
          duration: 10000
        });
        Alert.alert(`Requirement "${action}"!`,
          message, [{
            text: "OK", onPress: () => {
              this.assignRequirementsToState({ refresh: true });
            }
          }]
        );
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert(`Requirement not "${action}"!`,
          JSON.stringify(this.state.ApiErrors || this.state.Errors),
          (this.state.ApiErrors ? null :
            [{
              text: "OK", onPress: () => {
                this.assignRequirementsToState({ refresh: true });
              }
            }]
          )
        );
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
      var now = new Date();
      now.setHours(now.getHours() - 8);
      var outTime = result.out_time === null ? now : new Date(result.out_time);
      var inTime = result.in_time === null ? now : new Date(result.in_time);
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

  acceptRejectChangeRequest = (requirementData, action) => {
    let functionToExec = action === "Accepted" ? ApiCalls.acceptChangeRequest : ApiCalls.rejectChangeRequest;
    if (this._isMounted) {
      functionToExec({ reqID: requirementData.uid }).then(apiResults => {
        let message = `Requirement "${requirementData.name}" was successfully "${action}"!`;
        HandleError.showToastsInArr([message], {
          type: "success",
          duration: 10000
        });
        Alert.alert(`Requirement "${action}"!`,
          message, [{
            text: "OK", onPress: () => {
              this.assignRequirementsToState({ refresh: true });
            }
          }]
        );
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert(`Requirement not "${action}"!`,
          JSON.stringify(this.state.ApiErrors || this.state.Errors),
          (this.state.ApiErrors ? null :
            [{
              text: "OK", onPress: () => {
                this.assignRequirementsToState({ refresh: true });
              }
            }]
          )
        );
      });
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
          <Button style={styles.button} rounded primary
            onPress={() => this.props.navigation.navigate("CreateRequirement", { action: "edit", requirementData })}>
            <Text style={styles.requirementActivity}>Change</Text>
          </Button>
          <Button style={styles.button} rounded primary onPress={() => this.handleSubmit_Complete(requirementData)}>
            <Text style={styles.requirementActivity}>Complete</Text>
          </Button>
        </View>
      );
    } else if (requirementData.status === 3) {
      return (
        <View style={styles.requirementActivityView}>
          <Button style={styles.button} rounded primary onPress={() => this.acceptRejectChangeRequest(requirementData, "Accepted")}>
            <Text style={styles.requirementActivity}>Accept</Text>
          </Button>
          <Button style={styles.button} rounded primary onPress={() => this.acceptRejectChangeRequest(requirementData, "Rejected")}>
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
          {this.state.clockedTime === "null" ?
            <View style={styles.warningView} >
              <Icon style={styles.warningIcon} name="warning" />
              <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
            </View> :
            <View>
              {this.getTimeRemaining(requirementData)}
            </View>
          }
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
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="Requirements"
          leftIcon="back"
          onPress={{
            left: this.props.navigation.goBack,
            add: () => { this.props.navigation.navigate("CreateRequirement", { action: "create", projId: this.params.uid }); },
            refresh: () => {
              this.assignRequirementsToState({ refresh: true });
              this.assignTimeToState({ refresh: true });
            }
          }}
        />
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

  // Render Tabs
  _renderTabs() {
    if (this.getRenderFromState()) {
      return (
        <Tabs initialPage={this.params.initialPage}>
          <Tab heading="Active">
            <Content padder>
              {this.state.requirementList === "null" ?
                <View style={styles.warningView} >
                  <Icon style={styles.warningIcon} name="warning" />
                  <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
                </View> :
                <Accordion
                  dataArray={this.state.requirementList.initial}
                  renderHeader={this._renderAccordionHeader}
                  renderContent={this._renderAccordionContent}
                />
              }
            </Content>
          </Tab>
          <Tab heading="Pending" >
            <Content padder>
              {this.state.requirementList === "null" ?
                <View style={styles.warningView} >
                  <Icon style={styles.warningIcon} name="warning" />
                  <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
                </View> :
                <Accordion
                  dataArray={this.state.requirementList.pending}
                  renderHeader={this._renderAccordionHeader}
                  renderContent={this._renderAccordionContent}
                />
              }
            </Content>
          </Tab>
          <Tab heading="Completed" >
            <Content padder>
              {this.state.requirementList === "null" ?
                <View style={styles.warningView} >
                  <Icon style={styles.warningIcon} name="warning" />
                  <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
                </View> :
                <Accordion
                  dataArray={this.state.requirementList.completed}
                  renderHeader={this._renderAccordionHeader}
                  renderContent={this._renderAccordionContent}
                />
              }
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
        {
          expanded ?
            <Icon style={styles.expandedIconStyle} name="remove-circle" /> :
            <Icon style={styles.iconStyle} name="add-circle" />
        }
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
