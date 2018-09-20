import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text,
  List
} from "native-base";
import { Picker, View } from "react-native";
import styles from "./styles";
const ApiCalls = require("../../util/ApiCalls");
const Auth = require("../../util/Auth");


class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProjectName: "",
      ProjectDesc: "",
      team: "",
      isLoading: false,
      error: false,
      errorsList: [],
      createproj: false
    };
    //Auth.setIsLoginStateOnScreenEntry(this, { navigate: "CreateProject" });
  }

  assignteamsToState(opts = { refresh: false }) {
    if (!this.state.projectsList || opts.refresh) {
      ApiCalls.getTeams().then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            this.setState({
              teamlist: apiResults
            });
          }
        });
      });
    }
  }

  getteamsFromState() {
    if (this.state && this.state.teamlist) {
      return this.state.teamlist;
    }
    else {
      return [];
    }
  }

  handleSubmit = async () => {
    this.setState({ isLoading: true });
    let apiResult = await ApiCalls.createProject(this.state.ProjectName, this.state.ProjectDesc, this.state.team);
    let handledApiResults = await ApiCalls.handleAPICallResult(apiResult, this);
    if (handledApiResults) {
      this.setState({ createproj: true });
      this.props.navigation.navigate("Projects");
    }

  }

  render() {
    this.assignteamsToState;
    
    let createForm = <Form>
      <Item>
        <Input placeholder="Project Name"
          onChangeText={(value) => this.setState({ ProjectName: value })}
          value={this.state.ProjectName}
          onSubmitEditing={this.handleSubmit}
        />
      </Item>
      <Item>
        <Input style={{ width: 150, height: 150 }} placeholder="Project Description"
          onChangeText={(value) => this.setState({ ProjectDesc: value })}
          value={this.state.ProjectDesc}
          onSubmitEditing={this.handleSubmit}
        />
      </Item>
      <View>
        <Picker
          selectedValue={this.state.team}
          onValueChange={(tem) => this.setState({ team: tem })}>
          <List
            dataArray={this.getteamsFromState()}
            renderRow={data =>
              <Picker.Item label={data.name} value={data.uid} />
            }
            onSubmitEditing={this.handleSubmit}
          />
        </Picker>
      </View>
      <Button block style={{ margin: 15, marginTop: 50 }}
        onPress={this.handleSubmit}>
        <Text>Submit</Text>
      </Button>
    </Form>

    let CreteProjForm =
      <Button block success style={styles.mb15} onPress={() => { this.props.navigation.navigate("Projects"); }}>
        <Text>Project is Created</Text>
      </Button>;
    return (
      <Container style={styles.container}>
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
              onPress={() => this.assignteamsToState({ refresh: true })}
            >
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>
        <Content>
          {this.state.createproj ? CreteProjForm : createForm}
        </Content>
      </Container>
    );
  }
}

export default CreateProject;
