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
  View
} from "native-base";
import styles from "./styles";
import { TouchableOpacity, FlatList, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "Projects",
      setUserPermissions: true
    });
    Auth.userHasPermission.bind(this);
    this.assignProjectsToState.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
    this.assignProjectsToState({ refresh: true });
  });

  // Retrieve project list from API and assign to state.
  assignProjectsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.projectsList || opts.refresh)) {
      ApiCalls.getProjects().then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            apiResults.forEach(result => {
              result.modalVisible = false;
              result.key = result.uid.toString() + "_" + result.modalVisible.toString();
            });
            this.setState({
              projectsList: apiResults
            });
          }
        });
      });
    }
  }

  // Retrieve project list from state.
  getProjectsFromState() {
    if (this.state && this.state.projectsList) {
      return this.state.projectsList;
    } else {
      return [];
    }
  }

  // Handles the onClick event for the modal buttons.
  onModalButtonClick(projectData, buttonText) {
    this.closeModal(projectData);
    if (buttonText === "Project Info") {
      return this.props.navigation.navigate("ProjectInfo");
    } else {
      return this.props.navigation.navigate("Requirements");
    }
  }

  // Closes the modal.
  closeModal(projectData) {
    projectData.modalVisible = false;
    this.setState(JSON.parse(JSON.stringify(this.state)));
  }

  // Reduces text to 40 characters.
  truncate(text) {
    if (text.length > 40) {
      return `${text.substr(0, 40)}...`;
    } else {
      return text;
    }
  }

  // Render
  render() {
    this.assignProjectsToState();
    return (
      <Container style={styles.container}>
        {this._renderHeader()}
        {this._renderBody()}
      </Container>
    );
  }

  // Render Header
  _renderHeader() {
    return (
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
    );
  }

  // Render Body
  _renderBody() {
    return (
      <Content padder>
        <FlatList
          style={styles.container}
          data={this.getProjectsFromState()}
          renderItem={data => this._renderProjectData(data.item)}
        />
      </Content>
    );
  }

  // Render Project Data
  _renderProjectData(projectData) {
    return (
      <TouchableOpacity style={styles.projectItem} onPress={() => {
        projectData.modalVisible = true;
        this.setState(JSON.parse(JSON.stringify(this.state)));
      }}>
        <View style={styles.text}>
          <Text style={styles.title}>{projectData.name}</Text>
          <Text style={styles.body}>
            {this.truncate(projectData.desc)}
          </Text>
          <View style={styles.flex}>
            <Icon style={styles.time} name="time" />
            <Text style={styles.time}>
              {"  "}{projectData.created}
            </Text>
          </View>
        </View>
        <Icon style={styles.icon} name="more" />
        {this._renderModal(projectData)}
      </TouchableOpacity>
    );
  }

  // Render Modal
  // @TODO: Implement proper buttons menu and polish the UI
  _renderModal(projectData) {
    return (
      <TouchableWithoutFeedback onPress={() => this.closeModal(projectData)}>
        <Modal
          onBackdropPress={() => this.closeModal(projectData)}
          onBackButtonPress={() => this.closeModal(projectData)}
          onSwipe={() => this.closeModal(projectData)}
          swipeDirection="down"
          isVisible={projectData.modalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{projectData.name}</Text>
            <View style={styles.modalFlex}>
              {this._renderModalButton(projectData, "Project Info")}
              {this._renderModalButton(projectData, "Requirements")}
            </View>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }

  // Render Modal Button
  // @TODO: Implement OnClose
  _renderModalButton(projectData, buttonText) {
    return (
      <TouchableOpacity style={styles.modalButton} onPress={() => {
        this.onModalButtonClick(projectData, buttonText);
      }}>
        <Text style={styles.modalText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  }
}

export default Projects;
