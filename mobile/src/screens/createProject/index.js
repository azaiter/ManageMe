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
  Input,
  Label,
  Item,
  Form
} from "native-base";
import { Alert } from "react-native";
import styles from "./styles";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

const fieldsArr = [
  {
    name: "projectName",
    label: "Name",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "projectDesc",
    label: "Description",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "teamId",
    label: "Team",
    regex: /^[0-9]*$/,
    keyboardType: "default",
    secureTextEntry: false
  }
];

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      projectDesc: "",
      teamId: ""
    };
    // This line is creating an infinte loop of page renders.
    Auth.setIsLoginStateOnScreenEntry(this, {setUserPermissions: true });
    Auth.getPermissions.bind(this);
    this.checkAndSetState.bind(this);
    this.getFieldValidation.bind(this);
    this._renderHeader.bind(this);
    this._renderBody.bind(this);
    this._renderFieldEntry.bind(this);
  }

  assignTeamsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.teams || opts.refresh)) {
      ApiCalls.getTeams().then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            this.setState({
              teams: apiResults
            });
          }
        });
      });
    }
  }

  handleSubmit = async () => {
    this.setState({ isLoading: true });
    if (fieldsArr.filter(x => { return !this.state[x.name + "Validation"]; }).length > 0) {
      ApiCalls.showToastsInArr(["Some of the fields below are invalid."], {
        buttonText: "OK",
        type: "danger",
        position: "top",
        duration: 5 * 1000
      });
    }
    else {
      let apiResult = await ApiCalls.createProject(this.state.projectName, this.state.projectDesc, this.state.teamId);
      let handledApiResults = await ApiCalls.handleAPICallResult(apiResult, this);
      this.setState({ isLoading: false });
      if (handledApiResults) {
        let message = `Project "${this.state.projectName}" was added successfully!`;
        ApiCalls.showToastsInArr([message], {
          buttonText: "OK",
          type: "success",
          position: "top",
          duration: 10 * 1000
        });
        Alert.alert("Project Added!", message);
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

  async goBack() {
    await Auth.saveItem("@app.refreshProject", {refresh: true});
    this.props.navigation.goBack();
  }

  render() {
    this.assignTeamsToState();
    return (
      <Container style={styles.container}>
        {this._renderHeader()}
        {this._renderBody()}
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
          <Title>Create Project</Title>
        </Body>
        <Right>
          <Button transparent
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
      <Content padder>
        <Container>
          <Content>
            <Form>
              {this._renderFieldEntry(fieldsArr[0])}
              {/* TODO: Convert to TextArea */}
              {this._renderFieldEntry(fieldsArr[1])}
              {this._renderFieldEntry(fieldsArr[2])}
              <Button
                block style={{ margin: 15, marginTop: 50 }}
                onPress={this.handleSubmit}
              >
                <Text>Create Project</Text>
              </Button>
            </Form>
          </Content>
        </Container>
      </Content>
    );
  }

  _renderFieldEntry(obj) {
    return (
      <Item floatingLabel
        success={this.getFieldValidation(obj.name).success}
        error={this.getFieldValidation(obj.name).error} >
        <Label>{obj.label}</Label>
        <Input name={obj.name}
          onChangeText={(value) => this.checkAndSetState(obj.name, value, obj.regex)}
          value={this.state[obj.name]}
          onSubmitEditing={this.handleSubmit}
          keyboardType={obj.keyboardType || "default"}
          secureTextEntry={obj.secureTextEntry || false}
        />
      </Item>
    );
  }
}

export default CreateProject;
