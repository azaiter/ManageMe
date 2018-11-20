import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Text,
  Input,
  Label,
  Item,
  Form
} from "native-base";
import { Alert, Platform } from "react-native";
import styles from "./styles";
import {
  ManageMe_Header
} from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

const fieldsArr = [
  {
    name: "firstName",
    label: "First Name",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "lastName",
    label: "Last Name",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "email",
    label: "Email Address",
    regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    keyboardType: "email-address",
    secureTextEntry: false
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    regex: /^\d{10}$/,
    keyboardType: Platform.OS === "android" ? "phone-pad" : "number-pad",
    secureTextEntry: false
  },
  {
    name: "address",
    label: "Address",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "wage",
    label: "Wage",
    regex: /^\d+(.\d+)?$/,
    keyboardType: "numeric",
    secureTextEntry: false
  },
  {
    name: "username",
    label: "Username",
    regex: /^.+$/,
    keyboardType: "default",
    secureTextEntry: false
  },
  {
    name: "password",
    label: "Password",
    regex: /^(?=(?:[^A-Z]*[A-Z]){1})(?=[^!@#$&*]*[!@#$&*])(?=(?:[^0-9]*[0-9]){1}).{8,}$/,
    keyboardType: "default",
    secureTextEntry: false
  }
];

class CreateUser extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      wage: "",
      username: "",
      password: ""
    };
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "CreateUser",
      setUserPermissions: true
    });
    Auth.getPermissions.bind(this);
    this.checkAndSetState.bind(this);
    this.getFieldValidation.bind(this);
    this.handleSubmit.bind(this);
    this._renderBody.bind(this);
    this._renderFieldEntry.bind(this);
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

  handleSubmit = async () => {
    if (this._isMounted) {
      if (fieldsArr.filter(x => !this.state[x.name + "Validation"]).length > 0)  {
        ApiCalls.showToastsInArr(["Some of the fields below are invalid."], {
          buttonText: "OK",
          type: "danger",
          position: "top",
          duration: 5 * 1000
        });
      }
      else {
        if (this.params.action === "edit") {
          ApiCalls.updateUser(this.params.userData.uid, this.state.firstName, this.state.lastName, this.state.email, this.state.phoneNumber, this.state.address, this.state.wage).then(response => {
            ApiCalls.handleAPICallResult(response, this).then(apiResults => {
              if (apiResults) {
                let message = `User "${this.state.firstName} ${this.state.lastName}" was modified successfully!`;
                ApiCalls.showToastsInArr([message], {
                  buttonText: "OK",
                  type: "success",
                  position: "top",
                  duration: 10 * 1000
                });
                Alert.alert("User Modified!", message);
              } else {
                Alert.alert("User not Modified!", JSON.stringify(this.state.ApiErrorsList));
              }
            });
          });
        } else {
          ApiCalls.createUser(this.state.firstName, this.state.lastName, this.state.email, this.state.phoneNumber, this.state.address, this.state.username, this.state.password, this.state.wage).then(response => {
            ApiCalls.handleAPICallResult(response, this).then(apiResults => {
              if (apiResults) {
                let message = `User "${this.state.firstName} ${this.state.lastName}" was added successfully!`;
                ApiCalls.showToastsInArr([message], {
                  buttonText: "OK",
                  type: "success",
                  position: "top",
                  duration: 10 * 1000
                });
                Alert.alert("User Added!", message);
              } else {
                Alert.alert("User not Added!", JSON.stringify(this.state.ApiErrorsList));
              }
            });
          });
        }
      }
    }
  }

  setFieldValues() {
    if (this.params.action === "edit") {
      this.checkAndSetState(fieldsArr[0].name ,this.params.userData.first_name  ,fieldsArr[0].regex);
      this.checkAndSetState(fieldsArr[1].name ,this.params.userData.last_name   ,fieldsArr[1].regex);
      this.checkAndSetState(fieldsArr[2].name ,this.params.userData.email       ,fieldsArr[2].regex);
      this.checkAndSetState(fieldsArr[3].name ,this.params.userData.phone       ,fieldsArr[3].regex);
      this.checkAndSetState(fieldsArr[4].name ,this.params.userData.address     ,fieldsArr[4].regex);
      this.checkAndSetState(fieldsArr[5].name ,`${this.params.userData.wage}`   ,fieldsArr[5].regex);
      this.checkAndSetState(fieldsArr[6].name ,this.params.userData.username    ,fieldsArr[6].regex);
      this.checkAndSetState(fieldsArr[7].name ,"A!012345"                       ,fieldsArr[7].regex);
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
          title = {(this.params.action === "edit") ? "Edit User" : "Create User"}
          leftIcon = "back"
          onPress = {{ left: () => this.props.navigation.goBack() }}
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
              {this._renderFieldEntry(fieldsArr[6])}
              {this.params.action === "edit" ? null : this._renderFieldEntry(fieldsArr[7])}
              <Button
                block style={{ margin: 15, marginTop: 50 }}
                onPress={this.handleSubmit}
              >{
                this.params.action === "edit" ?
                  <Text>Edit User</Text> :
                  <Text>Create User</Text>
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
          disabled={obj.name === "username" && this.params.action === "edit" ? true : false}
        />
      </Item>
    );
  }
}

export default CreateUser;
