import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Text,
  Item,
  Label,
  Input,
  Form
} from "native-base";
import { Alert } from "react-native";
import styles from "./styles";
import { ManageMe_Header } from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");
const HandleError = require("../../util/HandleError");

const fieldsArr = [
  {
    name: "teamName",
    label: "Name",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "teamDesc",
    label: "Description",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
];

class CreateTeam extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      teamName: "",
      teamDesc: "",
    };
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "CreateTeam",
      setUserPermissions: true
    });
    Auth.userHasPermission.bind(this);
    this.checkAndSetState.bind(this);
    this.getFieldValidation.bind(this);
    this._renderBody.bind(this);
    this._renderFieldEntry.bind(this);
    this.handleSubmit.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", () => {
  });

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleSubmit = async () => {
    if (this._isMounted) {
      if (fieldsArr.filter(x => { return !this.state[x.name + "Validation"]; }).length > 0) {
        HandleError.showToastsInArr(["Some of the fields below are invalid."]);
      }
      else {
        ApiCalls.createTeam({
          teamName: this.state.teamName,
          desc: this.state.teamDesc
        }).then(apiResults => {
          let message = `Team "${this.state.teamName}" was added successfully!`;
          HandleError.showToastsInArr([message], {
            type: "success",
            duration: 10000
          });
          Alert.alert("Team Added!", message, [
            {
              text: "OK", onPress: () => {
                this.props.navigation.navigate("Teams");
              }
            },
          ]);
        }, error => {
          HandleError.handleError(this, error);
          Alert.alert("Team not added!",
            JSON.stringify(this.state.createTeam$ || this.state.Error),
            (this.state.Error ?
              [{
                text: "OK", onPress: () => {
                  this.props.navigation.navigate("CreateTeam");
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

  render() {
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="Create Team"
          leftIcon="back"
          onPress={{ left: () => this.props.navigation.goBack() }}
        />
        {this._renderBody()}
      </Container>
    );
  }

  _renderBody() {
    return (
      <Content padder>
        <Container>
          <Content>
            <Form>
              {this._renderFieldEntry(fieldsArr[0])}
              {this._renderFieldEntry(fieldsArr[1])}
              <Button
                block style={{ margin: 15, marginTop: 50 }}
                onPress={this.handleSubmit}
              >
                <Text>Create Team</Text>
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

export default CreateTeam;
