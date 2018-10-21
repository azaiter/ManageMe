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
  Form,
  Card,
  Spinner,
} from "native-base";
import styles from "./styles";
import { FlatList, Alert, TextInput } from "react-native";
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
  constructor(props) {
    super(props);
    this.state = {
      projectComment: "",
    };
    this.params = this.props.navigation.state.params;
    Auth.setIsLoginStateOnScreenEntry(this, { setUserPermissions: true });
    Auth.getPermissions.bind(this);
  }

  // Retrieve Requirements from API and assign to state.
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

  // Retrieve comments from API and assign to state.
  assignCommentsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.commentList || opts.refresh)) {
      ApiCalls.getProjectComments(this.params.uid).then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            this.setState({
              commentList: apiResults,
              renderComment: true
            });
          }
        });
      });
    }
  }

  // Retrieve Project Info from API and assign to state.
  assignProjectInfoToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.projectInfo || opts.refresh)) {
      ApiCalls.getProjectInfo(this.params.uid).then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            ApiCalls.getTeamById(apiResults[0].assigned_team).then(_response => {
              if (_response[1] === 200) {
                var teamName = _response[0][0].name;
                var teamid = _response[0][0].uid;
              } else {
                var teamName = "Not Assigned";
                var teamid = -1;
              }
              this.setState({
                teamName,
                teamid,
                projectInfo: apiResults,
                renderProjectInfo: true
              });
            });
          }
        });
      });
    }
  }

  // Retrieve Project Hours from API and assign to state.
  assignProjectHoursToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.projectHours || opts.refresh)) {
      ApiCalls.getProjectHours(this.params.uid).then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            this.setState({
              projectHours: apiResults,
              renderHours: true
            });
          }
        });
      });
    }
  }

  handleSubmit = async () => {
    this.setState({ isLoading: true });
    if (fieldsArr.filter(x => { return !this.state[x.name + "Validation"]; }).length > 0) {
      ApiCalls.showToastsInArr(["Comment field is invalid."], {
        buttonText: "OK",
        type: "danger",
        position: "top",
        duration: 5 * 1000
      });
    }
    else {
      let apiResult = await ApiCalls.addProjectComment(this.params.uid, this.state.projectComment);
      let handledApiResults = await ApiCalls.handleAPICallResult(apiResult, this);
      this.setState({ isLoading: false });
      this.setState({ projectComment: "" });
      if (handledApiResults) {
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
      }
    }
  }

  checkAndSetState(field, value, regex) {
    if (regex.test(value)) {
      this.setState({ [field]: value, [field + "Validation"]: true });
    }
    else {
      this.setState({ [field]: value, [field + "Validation"]: false });
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
            onPress={() => this.props.navigation.navigate("DrawerOpen")}
          >
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>Project Details</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => this.assignCommentsToState({ refresh: true })}
          >
            <Icon name="refresh" />
          </Button>
        </Right>
      </Header>
    );
  }

  // Render Tabs
  _renderTabs() {
    if ((this.state.renderRequirement && this.state.renderComment) && (this.state.renderHours && this.state.renderProjectInfo)) {
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
        <FlatList
          style={styles.container}
          data={this.state.projectInfo}
          renderItem={data => this._renderProject(data.item)}
          keyExtractor={item => item.uid.toString()}
        />
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
          </View>
          <Button
            transparent
            //@TODO to implement navigation to the Teams page//this.props.navigation.navigate("Requirements", { uid: info.uid})
            onPress={() => this.state.teamid === -1 ? null : null}
          >
            <View style={styles.flex}>
              <Text style={styles.requirementCount}>Team: </Text>
              <Text style={styles.requirementStatus}>{this.state.teamName}</Text>
            </View>
          </Button>
          <Text style={styles.projectHours}>
            {this.getTime()}
          </Text>
        </View>
        <View style={styles.flexRow}>
          <View>
            <Card style={styles.card}>
              <Text style={styles.projectTitle}>Requirements</Text>
              {this._renderRequirementButton("Active")}
              {this._renderRequirementButton("Pending")}
              {this._renderRequirementButton("Completed")}
            </Card>
          </View>
          <View style={styles.requirementView}>
            <Button style={styles.button} rounded primary><Text style={styles.projectActivity}>EDIT</Text></Button>
            <Button style={styles.button} rounded danger><Text style={styles.projectActivity}>DELETE</Text></Button>
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
        <View>
          <FlatList
            style={styles.flatlist}
            data={this.state.commentList}
            renderItem={data => this._renderComment(data.item)}
            keyExtractor={item => item.uid.toString()}
          />
        </View>
        <View>
          {this._renderFieldEntry(fieldsArr[0])}
          <Button
            block style={{ margin: 15, marginTop: 50 }}
            onPress={this.handleSubmit}
          >
            <Text>Add Comment</Text>
          </Button>
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

  _renderFieldEntry(obj) {
    return (
      <Form style={styles.card}>
        <TextInput
          style={styles.comment}
          placeholder={obj.label}
          name={obj.name}
          multiline={true}
          numberOfLines={4}
          onChangeText={(value) => this.checkAndSetState(obj.name, value, obj.regex)}
          value={this.state[obj.name]}
          onSubmitEditing={this.handleSubmit}
          keyboardType={obj.keyboardType || "default"}
          secureTextEntry={obj.secureTextEntry || false}
        />
      </Form>
    );
  }
}
export default ProjectInfo;
