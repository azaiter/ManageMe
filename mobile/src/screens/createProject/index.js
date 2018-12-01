import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Text,
  Icon,
  Input,
  Label,
  Item,
  Form,
  Picker,
} from "native-base";
import { Alert, View, Platform } from "react-native";
import styles from "./styles";
import {
  ManageMe_Header,
  ManageMe_LoadingScreen
} from "../../util/Render";
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
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      projectDesc: "",
      teamId: ""
    };
    this.params = this.props.navigation.state.params;
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "CreateProject",
      setUserPermissions: true
    });
    Auth.getPermissions.bind(this);
    this.assignTeamsToState.bind(this);
    this.getRenderFromState.bind(this);
    this.handleSubmit.bind(this);
    this.checkAndSetState.bind(this);
    this.getFieldValidation.bind(this);
    this.onTeamSelect.bind(this);
    this._renderBody.bind(this);
    this._renderSelectOption.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
  });

  componentDidMount() {
    this._isMounted = true;
    this.setFieldValues();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  assignTeamsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.teams || opts.refresh)) {
      ApiCalls.getTeams().then(response => {
        if (this._isMounted) {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            if (apiResults) {
              this.setState({
                teams: apiResults,
              });
            } else {
              this.setState({
                teams: "null"
              });
            }
          });
        }
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (this.state && this.state.teams) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit = async () => {
    if (this._isMounted) {
      if (fieldsArr.filter(x => !this.state[x.name + "Validation"]).length > 0) {
        ApiCalls.showToastsInArr(["Some of the fields below are invalid."], {
          buttonText: "OK",
          type: "danger",
          position: "top",
          duration: 5 * 1000
        });
      }
      else {
        if (this.params.action === "edit") {
          ApiCalls.updateProject(this.params.projectData.uid, this.state.projectName, this.state.projectDesc).then(response => {
            ApiCalls.handleAPICallResult(response, this).then(apiResults => {
              if (apiResults) {
                let message = `Project "${this.state.projectName}" was modified successfully!`;
                ApiCalls.showToastsInArr([message], {
                  buttonText: "OK",
                  type: "success",
                  position: "top",
                  duration: 10 * 1000
                });
                Alert.alert("Project modified!", message, [
                  {
                    text: "OK", onPress: () => {
                      this.props.navigation.navigate("Projects");
                    }
                  },
                ]);
              } else {
                Alert.alert("Project not modified", JSON.stringify(this.state.ApiErrorsList));
              }
            });
          });
        } else {
          ApiCalls.createProject(this.state.projectName, this.state.projectDesc, this.state.teamId).then(response => {
            ApiCalls.handleAPICallResult(response, this).then(apiResults => {
              if (apiResults) {
                let message = `Project "${this.state.projectName}" was added successfully!`;
                ApiCalls.showToastsInArr([message], {
                  buttonText: "OK",
                  type: "success",
                  position: "top",
                  duration: 10 * 1000
                });
                Alert.alert("Project Added!", message, [
                  {
                    text: "OK", onPress: () => {
                      this.props.navigation.navigate("Projects");
                    }
                  },
                ]);
              } else {
                Alert.alert("Project not Added", JSON.stringify(this.state.ApiErrorsList));
              }
            });
          });
        }
      }
    }
  }

  setFieldValues() {
    if (this.params.action === "edit") {
      this.checkAndSetState(fieldsArr[0].name, this.params.projectData.name, fieldsArr[0].regex);
      this.checkAndSetState(fieldsArr[1].name, this.params.projectData.desc, fieldsArr[1].regex);
      this.checkAndSetState(fieldsArr[2].name, this.params.projectData.assigned_team, fieldsArr[2].regex);
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

  onTeamSelect(value) {
    this.checkAndSetState(fieldsArr[2].name, value, fieldsArr[2].regex);
  }

  render() {
    this.assignTeamsToState();
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title={(this.params.action === "edit") ? "Edit Project" : "Create Project"}
          leftIcon="back"
          onPress={{
            left: () => this.props.navigation.goBack(),
            refresh: () => { this.assignTeamsToState({ refresh: true }); }
          }}
        />
        {this._renderBody()}
      </Container>
    );
  }

  _renderBody() {
    if (this.getRenderFromState()) {
      return (
        <Content padder>
          <Form>
            {/* Start Form */}
            {/* Project Name */}
            <Item floatingLabel
              success={this.getFieldValidation(fieldsArr[0].name).success}
              error={this.getFieldValidation(fieldsArr[0].name).error} >
              <Label>{fieldsArr[0].label}</Label>
              <Input name={fieldsArr[0].name}
                onChangeText={(value) => this.checkAndSetState(fieldsArr[0].name, value, fieldsArr[0].regex)}
                value={this.state[fieldsArr[0].name]}
                onSubmitEditing={this.handleSubmit}
                keyboardType={fieldsArr[0].keyboardType || "default"}
                secureTextEntry={fieldsArr[0].secureTextEntry || false}
              />
            </Item>
            {/* Project Team */}
            {this.params.action === "edit" ?
              null :
              <Item stackedLabel
                success={this.getFieldValidation(fieldsArr[2].name).success}
                error={this.getFieldValidation(fieldsArr[2].name).error} >
                <Label>{fieldsArr[2].label}</Label>
                {this.state.teams === "null" ?
                  <View style={styles.warningView} >
                    <Icon style={styles.warningIcon} name="warning" />
                    <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
                  </View> :
                  <Picker
                    value={this.state[fieldsArr[2].name]}
                    mode="dropdown"
                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: (Platform.OS === "ios") ? undefined : 200 }}
                    placeholder="Select a Team"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.teamId}
                    onValueChange={this.onTeamSelect.bind(this)}
                  >
                    {this.state.teams.map(team => this._renderSelectOption(team))}
                  </Picker>
                }
              </Item>
            }
            {/* Project Description */}
            <Item floatingLabel
              success={this.getFieldValidation(fieldsArr[1].name).success}
              error={this.getFieldValidation(fieldsArr[1].name).error}>
              <Label>{fieldsArr[1].label}</Label>
              <Input
                value={this.state[fieldsArr[1].name]}
                onChangeText={(value) => this.checkAndSetState(fieldsArr[1].name, value, fieldsArr[1].regex)}
                numberOfLines={5}
                multiline={true}
                style={{ height: 150 }}
              />
            </Item>
            {/* Submit Button */}
            <Button
              block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit}
            >
              {
                this.params.action === "edit" ?
                  <Text>Edit Project</Text> :
                  <Text>Create Project</Text>
              }
            </Button>
            {/* End Form */}
          </Form>
        </Content>
      );
    } else {
      return <ManageMe_LoadingScreen />;
    }
  }

  _renderSelectOption(team) {
    return (<Picker.Item label={team.name} value={team.uid} key={team.uid} />);
  }
}

export default CreateProject;
