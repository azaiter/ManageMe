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
import { Alert, Platform } from "react-native";
import styles from "./styles";
import { ManageMe_Header } from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

const fieldsArr = [
  {
    name: "reqName",
    label: "Name",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "reqDesc",
    label: "Description",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "est",
    label: "Estimate",
    regex: /^\d{1,2}$/,
    keyboardType: Platform.OS === "android" ? "phone-pad" : "number-pad",
    secureTextEntry: false
  },
  {
    name: "reqPriority",
    label: "Priority",
    regex: /^\d{1,2}$/,
    keyboardType: Platform.OS === "android" ? "phone-pad" : "number-pad",
    secureTextEntry: false
  },
  {
    name: "reqSoft",
    label: "Soft Cap",
    regex: /^\d{1,3}$/,
    keyboardType: Platform.OS === "android" ? "phone-pad" : "number-pad",
    secureTextEntry: false
  },
  {
    name: "reqHard",
    label: "Hard Cap",
    regex: /^\d{1,3}$/,
    keyboardType: Platform.OS === "android" ? "phone-pad" : "number-pad",
    secureTextEntry: false
  },
];

class CreateRequirement extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      reqName: "",
      reqDesc: "",
      est: "",
      reqPriority: "",
      reqSoft: "",
      reqHard: "",
    };
    this.params = this.props.navigation.state.params;
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "CreateRequirement",
      setUserPermissions: true
    });
    Auth.getPermissions.bind(this);
    this.checkAndSetState.bind(this);
    this.getFieldValidation.bind(this);
    this._renderBody.bind(this);
    this._renderFieldEntry.bind(this);
    this.handleSubmit.bind(this);
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

  setFieldValues() {
    if (this.params.action === "edit") {
      this.checkAndSetState(fieldsArr[0].name, this.params.requirementData.name, fieldsArr[0].regex);
      this.checkAndSetState(fieldsArr[1].name, this.params.requirementData.desc, fieldsArr[1].regex);
      this.checkAndSetState(fieldsArr[2].name, `${this.params.requirementData.estimate}`, fieldsArr[2].regex);
      this.checkAndSetState(fieldsArr[3].name, `${this.params.requirementData.priority}`, fieldsArr[3].regex);
      this.checkAndSetState(fieldsArr[4].name, `${this.params.requirementData.soft_cap}`, fieldsArr[4].regex);
      this.checkAndSetState(fieldsArr[5].name, `${this.params.requirementData.hard_cap}`, fieldsArr[5].regex);
    }
  }

  handleSubmit = async () => {
    if (this._isMounted) {
      if (fieldsArr.filter(x => { return !this.state[x.name + "Validation"]; }).length > 0) {
        ApiCalls.showToastsInArr(["Some of the fields below are invalid."], {
          buttonText: "OK",
          type: "danger",
          position: "top",
          duration: 5 * 1000
        });
      }
      else {
        if (this.params.action === "edit") {
          ApiCalls.createChangeRequest(this.params.requirementData.uid, this.state.est, this.state.reqDesc, this.state.reqName, this.state.reqSoft, this.state.reqHard, this.state.reqPriority).then(response => {
            ApiCalls.handleAPICallResult(response, this).then(apiResults => {
              if (apiResults) {
                let message = `Requirement "${this.state.reqName}" was modified successfully!`;
                ApiCalls.showToastsInArr([message], {
                  buttonText: "OK",
                  type: "success",
                  position: "top",
                  duration: 10 * 1000
                });
                Alert.alert("Requirement modified!", message, [
                  {
                    text: "OK", onPress: () => {
                      this.props.navigation.navigate("Requirements");
                    }
                  },
                ]);
              } else {
                Alert.alert("Requirement not modified", JSON.stringify(this.state.ApiErrorsList));
              }
            });
          });
        } else {
          ApiCalls.createRequirement(this.params.projId, this.state.est, this.state.reqDesc, this.state.reqName, this.state.reqSoft, this.state.reqHard, this.state.reqPriority).then(response => {
            ApiCalls.handleAPICallResult(response, this).then(apiResults => {
              if (apiResults) {
                let message = `Requirement "${this.state.reqName}" was added successfully!`;
                ApiCalls.showToastsInArr([message], {
                  buttonText: "OK",
                  type: "success",
                  position: "top",
                  duration: 10 * 1000
                });
                Alert.alert("Requirement Added!",
                  message,
                  [
                    {
                      text: "OK", onPress: () => {
                        this.props.navigation.navigate("Requirements");
                      }
                    },
                  ]);
              } else {
                Alert.alert("Requirement not Added", JSON.stringify(this.state.ApiErrorsList));
              }
            });
          });
        }
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
          title={(this.params.action === "edit") ? "Edit Requirement" : "Create Requirement"}
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
              {this._renderFieldEntry(fieldsArr[2])}
              {this._renderFieldEntry(fieldsArr[3])}
              {this._renderFieldEntry(fieldsArr[4])}
              {this._renderFieldEntry(fieldsArr[5])}
              <Button
                block style={{ margin: 15, marginTop: 50 }}
                onPress={this.handleSubmit}
              >
                {
                  this.params.action === "edit" ?
                    <Text>Edit Requirement</Text> :
                    <Text>Create Requirement</Text>
                }
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

export default CreateRequirement;
