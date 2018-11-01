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
import { Alert, Platform } from "react-native";
import styles from "./styles";
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
    this._renderHeader.bind(this);
    this._renderBody.bind(this);
    this._renderFieldEntry.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
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
        ApiCalls.showToastsInArr(["Some of the fields below are invalid."], {
          buttonText: "OK",
          type: "danger",
          position: "top",
          duration: 5 * 1000
        });
      }
      else {
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
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="ios-arrow-dropleft-circle" />
          </Button>
        </Left>
        <Body>
          <Title>Create User</Title>
        </Body>
        <Right />
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
              {this._renderFieldEntry(fieldsArr[1])}
              {this._renderFieldEntry(fieldsArr[2])}
              {this._renderFieldEntry(fieldsArr[3])}
              {this._renderFieldEntry(fieldsArr[4])}
              {this._renderFieldEntry(fieldsArr[5])}
              {this._renderFieldEntry(fieldsArr[6])}
              {this._renderFieldEntry(fieldsArr[7])}
              <Button
                block style={{ margin: 15, marginTop: 50 }}
                onPress={this.handleSubmit}
              >
                <Text>Add User</Text>
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

export default CreateUser;
