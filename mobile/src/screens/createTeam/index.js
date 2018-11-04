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
  Item,
  Label,
  Input,
  Form
} from "native-base";
import { Alert } from "react-native";
import styles from "./styles";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

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
    Auth.getPermissions.bind(this);
    this.checkAndSetState.bind(this);
    this.getFieldValidation.bind(this);
    this._renderHeader.bind(this);
    this._renderBody.bind(this);
    this._renderFieldEntry.bind(this);
    this.handleSubmit.bind(this);
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
        ApiCalls.createTeam(this.state.teamName, this.state.teamDesc).then(response => {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            if (apiResults) {
              let message = `Team "${this.state.teamName}" was added successfully!`;
              ApiCalls.showToastsInArr([message], {
                buttonText: "OK",
                type: "success",
                position: "top",
                duration: 10 * 1000
              });
              Alert.alert("Team Added!",
                message,
                [
                  {
                    text: "OK", onPress: () => {
                      this.props.navigation.navigate("Teams");
                    }
                  },
                ]);
            } else {
              Alert.alert("Team not Added", JSON.stringify(this.state.ApiErrorsList));
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
          <Title>Create Team</Title>
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
