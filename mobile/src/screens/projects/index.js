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
  List,
  View,
} from "native-base";
import styles from "./styles";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, { navigate: "Projects" });
  }

  assignProjectsToState(opts = { refresh: false }) {
    if (!this.state.projectsList || opts.refresh) {
      ApiCalls.getProjects().then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            this.setState({
              projectsList: apiResults
            });
          }
        });
      });
    }
  }

  getProjectsFromState() {
    if (this.state && this.state.projectsList) {
      return this.state.projectsList;
    }
    else {
      return [];
    }
  }

  trunc(text) {
    return text.length > 40 ? `${text.substr(0, 40)}...` : text;
  }
  

  render() {
    this.assignProjectsToState();
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
            <Title>Projects</Title>
          </Body>
          <Right style={styles.flex}>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("CreateProject")}
            >
              <Icon name="add" />
            </Button>
            <Button
              transparent
              onPress={() => this.assignProjectsToState({ refresh: true })}
            >
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>

        <Content padder>
          <List
            dataArray={this.getProjectsFromState()}
            renderRow={data =>
              <Button transparent
              style={styles.project_item}>
                <View style={styles.text}>
                  <Text style={styles.title}>{data.uid} - {data.name}</Text>
                  <Text style={styles.body}>
                    {this.trunc(data.desc)}
                  </Text>
                  <View style={styles.flex}>
                    <Icon style={styles.time} name="time" />
                    <Text style={styles.time}>
                      {"  "}{data.created}
                    </Text>
                  </View>
                </View>
                <View>
                  <Button transparent onPress={() =>
                    this.props.navigation.goBack()}>
                    <Icon style={styles.icon} name="more" />
                  </Button>
                </View>
              </Button>}
          />
        </Content>
      </Container>
    );
  }
}
export default Projects;