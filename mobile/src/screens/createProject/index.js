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
  Form,
  Picker,
  Textarea,
  Spinner,
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
    Auth.setIsLoginStateOnScreenEntry(this, { setUserPermissions: true });
    Auth.getPermissions.bind(this);
    this.checkAndSetState.bind(this);
    this.getFieldValidation.bind(this);
    this._renderHeader.bind(this);
    this._renderBody.bind(this);
  }

  assignTeamsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.teams || opts.refresh)) {
      ApiCalls.getTeams().then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            this.setState({
              teams: apiResults,
              render: true
            });
          }
        });
      });
    }
  }

  handleSubmit = async () => {
    this.setState({ isLoading: true });
    if (fieldsArr.filter(x => !this.state[x.name + "Validation"]).length > 0) {
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

  onTeamSelect(value) {
    this.checkAndSetState(fieldsArr[2].name, value, fieldsArr[2].regex);
  }

  async goBack() {
    await Auth.saveItem("@app.refreshProject", { refresh: true });
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
          <Button
            transparent
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="ios-arrow-dropleft-circle" />
          </Button>
          <Button
            transparent
            onPress={() => this.assignTeamsToState({ refresh: true })}
          >
            <Icon name="ios-refresh-circle" />
          </Button>
        </Right>
      </Header>
    );
  }

  _renderBody() {
    /*
      Label on its own breaks a return statement making it impossible to abstract.
      The item tag breaks all components except for input.
    */
    return (this.state.render) ? (
      <Content padder>
        <Form>
          {/* Start Form */}
          {/* Project Name */}
          <Label>{fieldsArr[0].label}</Label>
          <Input name={fieldsArr[0].name}
            onChangeText={(value) => this.checkAndSetState(fieldsArr[0].name, value, fieldsArr[0].regex)}
            value={this.state[fieldsArr[0].name]}
            onSubmitEditing={this.handleSubmit}
            keyboardType={fieldsArr[0].keyboardType || "default"}
            secureTextEntry={fieldsArr[0].secureTextEntry || false}
          />
          {/* Project Team */}
          <Label>{fieldsArr[2].label}</Label>
          <Form>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="ios-arrow-down-outline" />}
              style={{ width: undefined }}
              placeholder="Select a Team"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={this.state.teamId}
              onValueChange={this.onTeamSelect.bind(this)}
            >
              {this.state.teams.map(team => this._renderSelectOption(team))}
            </Picker>
          </Form>
          {/* Project Description */}
          <Label>{fieldsArr[1].label}</Label>
          <Textarea
            onChangeText={(value) => this.checkAndSetState(fieldsArr[1].name, value, fieldsArr[1].regex)}
            rowSpan={5}
            bordered
          />
          {/* Submit Button */}
          <Button
            block style={{ margin: 15, marginTop: 50 }}
            onPress={this.handleSubmit}
          >
            <Text>Create Project</Text>
          </Button>
          {/* End Form */}
        </Form>
      </Content>
    ) : (
        <Content padder>
          <Spinner color="blue" />
        </Content>
      );
  }

  _renderSelectOption(team) {
    return (<Item label={team.name} value={team.uid} key={team.uid} />);
  }
}

export default CreateProject;
