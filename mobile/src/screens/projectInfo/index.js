import React, { Component } from "react";
import {
  Container,
  Tabs,
  Button,
  Tab,
  Content,
  Icon,
  View,
  Text,
  Card,
  Spinner,
  Input,
} from "native-base";
import styles from "./styles";
import { FlatList, Alert } from "react-native";
import { ManageMe_Header } from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

const fieldsArr = [
  {
    name: "projectComment",
    label: "Comment",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
];

class ProjectInfo extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      projectComment: "",
    };
    this.params = this.props.navigation.state.params;
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "ProjectInfo",
      setUserPermissions: true
    });
    Auth.userHasPermission.bind(this);
    this.assignRequirementsToState.bind(this);
    this.assignCommentsToState.bind(this);
    this.assignProjectInfoToState.bind(this);
    this.assignProjectHoursToState.bind(this);
    this.getRenderFromState.bind(this);
    this.checkAndSetState.bind(this);
    this.handleSubmit.bind(this);
    this.getFieldValidation.bind(this);
    this.getRequirementsCount.bind(this);
    this.getTime.bind(this);
    this.getInitialPage.bind(this);
    this._renderTabs.bind(this);
    this._renderLoadingScreen.bind(this);
    this._renderProjectInfo.bind(this);
    this._renderProject.bind(this);
    this._renderRequirementButton.bind(this);
    this._renderProjectComments.bind(this);
    this._renderComment.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
    this.assignRequirementsToState({ refresh: true });
    this.assignCommentsToState({ refresh: true });
    this.assignProjectInfoToState({ refresh: true });
    this.assignProjectHoursToState({ refresh: true });
  });

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Retrieve Requirements from API and assign to state.
  assignRequirementsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.requirementList || opts.refresh)) {
      ApiCalls.getRequirementsByProjectId(this.params.uid).then(response => {
        if (this._isMounted) {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            let requirementList = {};
            requirementList.initial = [];
            requirementList.completed = [];
            requirementList.pending = [];
            requirementList.changeRequest = [];
            if (apiResults) {
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
            } else {
              this.setState({
                requirementList: "null"
              });
            }
          });
        }
      });
    }
  }

  // Retrieve comments from API and assign to state.
  assignCommentsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.commentList || opts.refresh)) {
      ApiCalls.getProjectComments(this.params.uid).then(response => {
        if (this._isMounted) {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            if (apiResults) {
              this.setState({
                commentList: apiResults
              });
            } else {
              this.setState({
                commentList: "null"
              });
            }
          });
        }
      });
    }
  }

  // Retrieve Project Info from API and assign to state.
  assignProjectInfoToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.projectInfo || opts.refresh)) {
      ApiCalls.getProjectInfo(this.params.uid).then(response => {
        if (this._isMounted) {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            if (apiResults) {
              ApiCalls.getTeamById(apiResults[0].assigned_team).then(_response => {
                ApiCalls.handleAPICallResult(_response, this).then(_apiResults => {
                  if (_apiResults) {
                    this.setState({
                      teamData: _apiResults
                    });
                  } else {
                    this.setState({
                      teamData: "null"
                    });
                  }
                  this.setState({
                    projectInfo: apiResults
                  });
                });
              });
            } else {
              this.setState({
                projectInfo: "null"
              });
            }
          });
        }
      });
    }
  }

  // Retrieve Project Hours from API and assign to state.
  assignProjectHoursToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.projectHours || opts.refresh)) {
      ApiCalls.getProjectHours(this.params.uid).then(response => {
        if (this._isMounted) {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            if (apiResults) {
              this.setState({
                projectHours: apiResults
              });
            } else {
              this.setState({
                projectHours: "null"
              });
            }
          });
        }
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (this.state.requirementList && this.state.commentList && this.state.projectHours && this.state.projectInfo && this.state) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit = async () => {
    if (this._isMounted) {
      if (fieldsArr.filter(x => { return !this.state[x.name + "Validation"]; }).length > 0) {
        ApiCalls.showToastsInArr(["Comment field is invalid."], {
          buttonText: "OK",
          type: "danger",
          position: "top",
          duration: 5 * 1000
        });
      }
      else {
        ApiCalls.addProjectComment(this.params.uid, this.state.projectComment).then(response => {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            this.setState({ projectComment: "" });
            if (apiResults) {
              let message = "Comment was added successfully!";
              ApiCalls.showToastsInArr([message], {
                buttonText: "OK",
                type: "success",
                position: "top",
                duration: 10 * 1000
              });
              Alert.alert(
                "Comment Added!",
                message,
                [
                  {
                    text: "OK", onPress: () => {
                      this.assignCommentsToState({ refresh: true });
                    }
                  },
                ]
              );
            } else {
              Alert.alert("Comment not Added!", JSON.stringify(this.state.ApiErrorsList));
            }
          });
        });
      }
    }
  }

  checkAndSetState(field, value, regex) {
    if (this._isMounted) {
      if (regex.test(value)) {
        this.setState({ [field]: value, [field + "Validation"]: true });
      }
      else {
        this.setState({ [field]: value, [field + "Validation"]: false });
      }
    }
  }

  getFieldValidation(field) {
    if (this.state[field].length === 0) {
      return { success: false, error: false };
    }
    if (this.state && this.state[field + "Validation"]) {
      return { success: true, error: false };
    }
    else {
      return { success: false, error: true };
    }
  }

  // Get Requirement count.
  getRequirementsCount(status) {
    if (status === "Pending") {
      return this.state.requirementList.pending.length;
    } else if (status === "Completed") {
      return this.state.requirementList.completed.length;
    } else {
      return this.state.requirementList.initial.length;
    }
  }

  // Get Time.
  getTime() {
    if (this.state.projectHours.length === 2) {
      return "\n Project is " + ((this.state.projectHours[0]["SUM(soft_cap)"] / this.state.projectHours[1]["SUM(soft_cap)"]) * 100).toFixed(2) + " % Complete (on track)\n";
    } else {
      return null;
    }
  }

  // Get Requirement count.
  getInitialPage(status) {
    if (status === "Pending") {
      return 1;
    } else if (status === "Completed") {
      return 2;
    } else {
      return 0;
    }
  }

  // Render
  render() {
    this.assignRequirementsToState();
    this.assignCommentsToState();
    this.assignProjectHoursToState();
    this.assignProjectInfoToState();
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="Project Details"
          leftIcon="back"
          onPress={{
            left: this.props.navigation.goBack,
            refresh: () => {
              this.assignRequirementsToState({ refresh: true });
              this.assignCommentsToState({ refresh: true });
              this.assignProjectInfoToState({ refresh: true });
              this.assignProjectHoursToState({ refresh: true });
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
        <Tabs>
          <Tab heading="Information">
            {this._renderProjectInfo()}
          </Tab>
          <Tab heading="Comments">
            {this._renderProjectComments()}
          </Tab>
        </Tabs>
      );
    } else {
      return this._renderLoadingScreen();
    }
  }

  // Render Project Info
  _renderProjectInfo() {
    return (
      <Content padder>
        {this.state.projectInfo === "null" ?
          <View style={styles.warningView} >
            <Icon style={styles.warningIcon} name="warning" />
            <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
          </View> :
          <FlatList
            style={styles.container}
            data={this.state.projectInfo}
            renderItem={data => this._renderProject(data.item)}
            keyExtractor={item => item.uid.toString()}
          />
        }
      </Content >
    );
  }

  _renderProject(info) {
    return (
      <View>
        <View>
          <Text style={styles.projectTitle}>
            {info.name}
          </Text>
          <Text style={styles.projectDesc}>
            {info.desc}{"\n"}
          </Text>
          <View style={styles.flex}>
            <Icon style={styles.projectTime} name="time" />
            <Text style={styles.projectTime}>
              {"  "}{info.created}
            </Text>
          </View>{this.state.teamData === "null" ?
            <View style={styles.warningView} >
              <Icon style={styles.warningIcon} name="warning" />
              <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
            </View> :
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("TeamMembers", { uid: this.state.teamData[0].uid })}
            >
              <View style={styles.flex}>
                <Text style={styles.requirementCount}>Team: </Text>
                <Text style={styles.requirementStatus}>{this.state.teamData[0].name}</Text>
              </View>
            </Button>
          }
          {this.state.projectHours === "null" ?
            <View style={styles.warningView} >
              <Icon style={styles.warningIcon} name="warning" />
              <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
            </View> :
            <Text style={styles.projectHours}>
              {this.getTime()}
            </Text>
          }
        </View>
        <View style={styles.flexRow}>
          <View>
            <Card style={styles.card}>
              <Text style={styles.projectTitle}>Requirements</Text>
              {this.state.requirementList === "null" ?
                <View style={styles.warningView} >
                  <Icon style={styles.warningIcon} name="warning" />
                  <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
                </View> :
                <View>
                  {this._renderRequirementButton("Active")}
                  {this._renderRequirementButton("Pending")}
                  {this._renderRequirementButton("Completed")}
                </View>
              }
            </Card>
          </View>
          <View style={styles.requirementView}>
            <Button style={styles.button} rounded primary
              onPress={() => this.props.navigation.navigate("CreateProject", { action: "edit", projectData: info })}>
              <Text style={styles.projectActivity}>EDIT</Text></Button>
          </View>
        </View>
      </View>
    );
  }

  // Render Requirement Button
  _renderRequirementButton(status) {
    return (
      <Button
        transparent
        onPress={() => this.props.navigation.navigate("Requirements", { uid: this.params.uid, initialPage: this.getInitialPage(status) })}
      >
        <View style={styles.flex}>
          <Text style={styles.requirementStatus}>{status}{":"}</Text>
        </View>
        <View>
          <Text style={styles.requirementCount}>{this.getRequirementsCount(status)}</Text>
        </View>
      </Button>
    );
  }

  // Render Project Comments
  _renderProjectComments() {
    return (
      <Content padder >
        <View style={styles.comment}>
          <Input
            onChangeText={(value) => this.checkAndSetState(fieldsArr[0].name, value, fieldsArr[0].regex)}
            placeholder="Enter Comment"
            onSubmitEditing={this.handleSubmit}
            numberOfLines={5}
            multiline={true}
            style={{ height: 100 }}
            value={this.state[fieldsArr[0].name]}
          />
        </View>
        <View>
          {this.state.commentList === "null" ?
            <View style={styles.warningView} >
              <Icon style={styles.warningIcon} name="warning" />
              <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
            </View> :
            <FlatList
              data={this.state.commentList}
              renderItem={data => this._renderComment(data.item)}
              keyExtractor={item => item.uid.toString()}
            />
          }
        </View>
      </Content >
    );
  }

  // Render each comment
  _renderComment(projectComment) {
    return (
      <View style={styles.card}>
        <View style={styles.commentFlex}>
          <Text style={styles.commentTitle}>{projectComment.fullName}{" : "}</Text>
          <Text style={styles.commentTime}>{projectComment.entered}</Text>
        </View>
        <Text style={styles.commentBody}>{projectComment.comment}</Text>
      </View>
    );
  }
}
export default ProjectInfo;
