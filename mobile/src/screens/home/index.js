import React, { Component } from "react";
import { ImageBackground, View, StatusBar} from "react-native";
import { Container, Button, Text, Content, Form, Item, Label, Input } from "native-base";

import styles from "./styles";

const launchscreenBg = require("../../../assets/launchscreen-bg.png");
const launchscreenLogo = require("../../../assets/logo-kitchen-sink.png");
const ApiCalls = require("../../util/ApiCalls");
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
    Auth.setIsLoginStateOnScreenEntry(this, {navigate:"Projects"});
  }

  handleSubmit = async ()=> {
    this.setState({isLoading: true});
    let apiResult = await ApiCalls.getToken(this.state.username, this.state.password);
    let handledApiResults = await ApiCalls.handleAPICallResult(apiResult, this);
    if (handledApiResults){
      await Auth.saveItem("loginTokenObj", handledApiResults);
      this.setState({loggedIn: true});
      this.props.navigation.navigate("Projects");
    }
    //console.log("handledApiResults", handledApiResults);
  }

  render() {
    let loginForm = <Form>
    <Item floatingLabel>
      <Label>Username</Label>
      <Input name="username"
        onChangeText={(value) => this.setState({username: value})}
        value={this.state.username}
        onSubmitEditing={this.handleSubmit}
      />
    </Item>
    <Item floatingLabel last>
      <Label>Password</Label>
      <Input name="password" secureTextEntry
        onChangeText={(value) => this.setState({password: value})}
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
    <Button block success style={styles.mb15} onPress={()=>{this.props.navigation.navigate("DrawerOpen");}}>
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
