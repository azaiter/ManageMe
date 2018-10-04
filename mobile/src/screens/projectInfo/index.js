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
import { FlatList, Alert, TextInput, TouchableOpacity } from "react-native";
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
      ApiCalls.getRequirementsByProjectId(this.params.project.uid).then(response => {
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
      ApiCalls.getProjectComments(this.params.project.uid).then(response => {
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

  // Retrieve Project Hours from API and assign to state.
  assignProjectHoursToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.projectHours || opts.refresh)) {
      ApiCalls.getProjectHours(this.params.project.uid).then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            //console.log(apiResults);  
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
      let apiResult = await ApiCalls.addProjectComment(this.params.project.uid, this.state.projectComment);
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
  getRequirementsCount(text) {
    if (text === "Pending:") {
      return this.state.requirementList.pending.length;
    } else if (text === "Completed:") {
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
  getInitialPage(text) {
    if (text === "Pending:") {
      return 1;
    } else if (text === "Completed:") {
      return 2;
    } else {
      return 0;
    }
  }

  // Render
  render() {

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
    this.assignRequirementsToState();
    this.assignCommentsToState();
    this.assignProjectHoursToState();
    if ((this.state.renderRequirement && this.state.renderComment) && this.state.renderHours) {
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
        <View>
          <Text style={styles.title}>
            {this.params.project.name}
          </Text>
          <Text style={styles.body}>
            {this.params.project.desc}{"\n"}
          </Text>
          <View style={styles.flex}>
            <Icon style={styles.time} name="time" />
            <Text style={styles.time}>
              {"  "}{this.params.project.created}
            </Text>
          </View>
          <Text style={styles.commentTitle1}>
            {this.getTime()}
          </Text>
        </View>
        <View style={styles.flexRow}>
          <View>
            <Card style={styles.card}>
              <Text style={styles.title}>Requirements</Text>
              {this._renderRequirementButton("Active:")}
              {this._renderRequirementButton("Pending:")}
              {this._renderRequirementButton("Completed:")}
            </Card>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.buttonBlue} transparent><Text style={styles.buttonText2}>EDIT</Text></TouchableOpacity>
            <TouchableOpacity style={styles.buttonBlue} transparent><Text style={styles.buttonText2}>TEAM</Text></TouchableOpacity>
            <TouchableOpacity style={styles.buttonRed} transparent><Text style={styles.buttonText2}>DELETE</Text></TouchableOpacity>
          </View>
        </View>
      </Content >
    );
  }

  // Render Requirement Button
  _renderRequirementButton(text) {
    return (
      <Button
        transparent
        onPress={() => this.props.navigation.navigate("Requirements", { project: this.params.project, initialPage: this.getInitialPage(text) })}
      >
        <View style={styles.flex}>
          <Text style={styles.buttonText}>{text}</Text>
        </View>
        <View>
          <Text style={styles.buttonText1}>{this.getRequirementsCount(text)}</Text>
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
