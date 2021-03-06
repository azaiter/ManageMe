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
  Input,
} from "native-base";
import styles from "./styles";
import {
  FlatList,
  Alert
} from "react-native";
import {
  ManageMe_Header,
  ManageMe_LoadingScreen,
  ManageMe_DisplayError
} from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");
const HandleError = require("../../util/HandleError");

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
    this.assignRequirementsToState();
    this.assignCommentsToState();
    this.assignProjectHoursToState();
    this.assignProjectInfoToState();
    Auth.userHasPermission.bind(this);
    this.getRenderFromState.bind(this);
    this.checkAndSetState.bind(this);
    this.handleSubmit.bind(this);
    this.getFieldValidation.bind(this);
    this.getRequirementsCount.bind(this);
    this.getTime.bind(this);
    this.getInitialPage.bind(this);
    this._renderTabs.bind(this);
    this._renderProjectInfo.bind(this);
    this._renderProject.bind(this);
    this._renderRequirementButton.bind(this);
    this._renderProjectComments.bind(this);
    this._renderComment.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", () => {
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
    if ((this.state && this._isMounted) && (!this.state.requirementList || opts.refresh)) {
      this.setState({
        requirementList: undefined,
        getRequirementsByProjectId: undefined
      });
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
          JSON.stringify(this.state.getRequirementsByProjectId || this.state.Error),
          (this.state.Error ?
            [{
              text: "OK", onPress: () => {
                this.assignRequirementsToState({ refresh: true });
              }
            }] : null
          ), { cancelable: false }
        );
      });
    }
  }

  // Retrieve comments from API and assign to state.
  assignCommentsToState(opts = { refresh: false }) {
    if ((this.state && this._isMounted) && (!this.state.commentList || opts.refresh)) {
      this.setState({
        commentList: undefined,
        getProjectComments: undefined
      });
      ApiCalls.getProjectComments({ projID: this.params.uid }).then(apiResults => {
        this.setState({
          commentList: apiResults
        });
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert("Error!",
          JSON.stringify(this.state.getProjectComments || this.state.Error),
          (this.state.Error ?
            [{
              text: "OK", onPress: () => {
                this.assignCommentsToState({ refresh: true });
              }
            }] : null
          ), { cancelable: false }
        );
      });
    }
  }

  // Retrieve Project Info from API and assign to state.
  assignProjectInfoToState(opts = { refresh: false }) {
    if ((this.state && this._isMounted) && (!this.state.projectInfo || opts.refresh)) {
      this.setState({
        projectInfo: undefined,
        getProjectInfo: undefined,
        teamData: undefined,
        getTeamById: undefined
      });
      ApiCalls.getProjectInfo({ proj_id: this.params.uid }).then(response => {
        this.setState({
          projectInfo: response
        });
        ApiCalls.getTeamById({ teamId: response[0].assigned_team }).then(apiResults => {
          this.setState({
            teamData: apiResults
          });
        }, error => {
          HandleError.handleError(this, error);
          Alert.alert("Error!",
            JSON.stringify(this.state.getTeamById || this.state.Error),
            (this.state.Error ?
              [{
                text: "OK", onPress: () => {
                  this.assignProjectInfoToState({ refresh: true });
                }
              }] : null
            ), { cancelable: false });
        });
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert("Error!",
          JSON.stringify(this.state.getProjectInfo || this.state.Error),
          (this.state.Error ?
            [{
              text: "OK", onPress: () => {
                this.assignProjectInfoToState({ refresh: true });
              }
            }] : null
          ), { cancelable: false }
        );
      });
    }
  }

  // Retrieve Project Hours from API and assign to state.
  assignProjectHoursToState(opts = { refresh: false }) {
    if ((this.state && this._isMounted) && (!this.state.projectHours || opts.refresh)) {
      this.setState({
        projectHours: undefined,
        getProjectHours: undefined
      });
      ApiCalls.getProjectHours({ projId: this.params.uid }).then(apiResults => {
        this.setState({
          projectHours: apiResults
        });
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert("Error!",
          JSON.stringify(this.state.getProjectHours || this.state.Error),
          (this.state.Error ?
            [{
              text: "OK", onPress: () => {
                this.assignProjectHoursToState({ refresh: true });
              }
            }] : null
          ), { cancelable: false }
        );
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (
      this.state &&
      (this.state.requirementList || this.state.getRequirementsByProjectId) &&
      (this.state.commentList || this.state.getProjectComments) &&
      (this.state.projectHours || this.state.getProjectHours) &&
      (this.state.projectInfo || this.state.getProjectInfo) &&
      (this.state.teamData || this.state.getTeamById)
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit = async () => {
    if (this._isMounted) {
      if (fieldsArr.filter(x => { return !this.state[x.name + "Validation"]; }).length > 0) {
        HandleError.showToastsInArr(["Comment field is invalid."]);
      }
      else {
        ApiCalls.addProjectComment({ projID: this.params.uid, comment: this.state.projectComment }).then(() => {
          this.setState({ projectComment: "" });
          let message = "Comment was added successfully!";
          HandleError.showToastsInArr([message], {
            type: "success",
            duration: 10000
          });
          Alert.alert("Comment Added!", message, [{
            text: "OK", onPress: () => {
              this.assignCommentsToState({ refresh: true });
            }
          }]);
        }, error => {
          HandleError.handleError(this, error);
          Alert.alert("Comment not Added!!",
            JSON.stringify(this.state.addProjectComment || this.state.Error),
            (this.state.Error ?
              [{
                text: "OK", onPress: () => {
                  this.assignCommentsToState({ refresh: true });
                }
              }] : null
            ), { cancelable: false }
          );
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
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="Project Details"
          leftIcon="back"
          onPress={{
            left: () => this.props.navigation.goBack(),
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
      return <ManageMe_LoadingScreen />;
    }
  }

  // Render Project Info
  _renderProjectInfo() {
    return (
      <Content padder>
        {this.state.getProjectInfo ?
          <ManageMe_DisplayError
            ApiErrors={this.state.getProjectInfo}
          /> :
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
          </View>{this.state.getTeamById ?
            <ManageMe_DisplayError
              ApiErrors={this.state.getTeamById}
            /> :
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
          {this.state.getProjectHours ?
            <ManageMe_DisplayError
              ApiErrors={this.state.getProjectHours}
            /> :
            <Text style={styles.projectHours}>
              {this.getTime()}
            </Text>
          }
        </View>
        <View style={styles.flexRow}>
          <View>
            <Card style={styles.card}>
              <Text style={styles.projectTitle}>Requirements</Text>
              {this.state.getRequirementsByProjectId ?
                <ManageMe_DisplayError
                  ApiErrors={this.state.getRequirementsByProjectId}
                /> :
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
          {this.state.getProjectComments ?
            <ManageMe_DisplayError
              ApiErrors={this.state.getProjectComments}
            /> :
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
