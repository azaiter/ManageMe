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
  List,
  View,
  Picker
} from "native-base";
import styles from "./styles";

const ApiCalls = require("../../util/ApiCalls");
const Auth = require("../../util/Auth");

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      projectDesc: "",
      teamId: "",
      isLoading: false,
      error: false,
      errorsList: [],
      projectCreated: false
    };
    //Auth.setIsLoginStateOnScreenEntry(this, { navigate: "CreateProject" });
  }

  // Retrieve teams list from API and assign to state.
  assignTeamsToState() {
    if (!this.state.teamsList) {
      ApiCalls.getTeams().then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            this.setState({
              teamList: apiResults
            });
          }
        });
      });
    }
  }

  // Retrieve teams list from state.
  getTeamsFromState() {
    if (this.state && this.state.teamList) {
      return this.state.teamList;
    }
    else {
      return [];
    }
  }

  // Create project through Api
  handleSubmit() {
    this.setState({ isLoading: true });
    ApiCalls.createProject(this.state.projectName, this.state.projectDesc, this.state.teamId)
      .then(response => {
        ApiCalls.handleAPICallResult(response)
        .then(apiResults => {
          if (apiResults) {
            this.setState({ projectCreated: true });
            this.props.navigation.navigate("Projects");
          }
        });
      });
  }

  render() {
    let createForm = <Form>
      <Item>
        <Input style={{ width: "100%", height: 50 }} placeholder="Project Name"
          onChangeText={(value) => this.setState({ ProjectName: value })}
          value={this.state.ProjectName}
          onSubmitEditing={this.handleSubmit}
        />
      </Item>
      <Item>
        <Input style={{ width: "100%", height: 150 }} placeholder="Project Description"
          multiline={true} numberOfLines={4}
          onChangeText={(value) => this.setState({ ProjectDesc: value })}
          value={this.state.ProjectDesc}
          onSubmitEditing={this.handleSubmit}
        />
      </Item>
      <Picker

        mode="dropdown"
        selectedValue={this.state.team}
        onValueChange={(tem) => this.setState({ team: tem })}
        onSubmitEditing={this.handleSubmit}>
        <View
          dataArray={this.getTeamsFromState()}
          renderRow={data =>
            <Item label={data.name} value={data.uid} />
          }
        />
      </Picker>
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
        </Right>
      </Header>
      <Content padder>
        {this.state.createproj ? CreteProjForm : createForm}
      </Content>
      </Container>
    );
  }
}

export default CreateProject;