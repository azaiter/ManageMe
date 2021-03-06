import React, { Component } from "react";
import { ImageBackground, View, StatusBar, Alert } from "react-native";
import { Container, Button, Text, Content, Form, Item, Label, Input } from "native-base";
import styles from "./styles";

const launchscreenBg = require("../../../assets/launchscreen-bg.png");
const launchscreenLogo = require("../../../assets/logo-kitchen-sink.png");
const ApiCalls = require("../../util/ApiCalls");
const HandleError = require("../../util/HandleError");
const Auth = require("../../util/Auth");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLoading: false,
      error: false,
      errorsList: [],
      loggedIn: false
    };
    //Auth.logout(this);
    Auth.setIsLoginStateOnScreenEntry(this, { navigate: "Projects" });
  }

  handleSubmit = async () => {
    this.setState({ isLoading: true });
    ApiCalls.getToken({
      user: this.state.username,
      pass: this.state.password
    }).then(apiResults => {
      Auth.setLocalToken(apiResults);
      this.setState({ loggedIn: true });
      this.props.navigation.navigate("Projects");
    }, error => {
      HandleError.handleError(this, error);
      Alert.alert("Error Logging In!",
        JSON.stringify(this.state.getToken || this.state.Error),
        (this.state.Error ?
          [{
            text: "OK", onPress: () => {
              this.props.navigation.navigate("Home");
            }
          }] : null
        ), { cancelable: false }
      );
    });
  }

  render() {
    let loginForm = <Form>
      <Item floatingLabel>
        <Label>Username</Label>
        <Input name="username"
          onChangeText={(value) => this.setState({ username: value })}
          value={this.state.username}
          onSubmitEditing={this.handleSubmit}
        />
      </Item>
      <Item floatingLabel last>
        <Label>Password</Label>
        <Input name="password" secureTextEntry
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password}
          onSubmitEditing={this.handleSubmit}
        />
      </Item>
      <Button
        block style={{ margin: 15, marginTop: 50 }}
        onPress={this.handleSubmit}
      >
        <Text>Sign In</Text>
      </Button>
    </Form>;

    let signedInForm =
      <Button block success onPress={() => { this.props.navigation.openDrawer(); }}>
        <Text>You are logged in, Click to View Menu</Text>
      </Button>;

    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
          <Content>
            <View style={styles.logoContainer}>
              <ImageBackground source={launchscreenLogo} style={styles.logo} />
            </View>
            {this.state.loggedIn ? signedInForm : loginForm}
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}
export default Home;
