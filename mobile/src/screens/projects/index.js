import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  Icon,
  View,
  Spinner,
} from "native-base";
import styles from "./styles";
import { TouchableOpacity, FlatList, TouchableWithoutFeedback } from "react-native";
import { _Header, _DisplayError } from "../../util/Render";
import Modal from "react-native-modal";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");
const HandleError = require("../../util/HandleError");

class Projects extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "Projects",
      setUserPermissions: true
    });
    Auth.userHasPermission.bind(this);
    this.assignProjectsToState.bind(this);
    this.getRenderFromState.bind(this);
    this._renderBody.bind(this);
    this._renderLoadingScreen.bind(this);
    this._renderProjectData.bind(this);
    this._renderModal.bind(this);
    this._renderModalButton.bind(this);
    this.onModalButtonClick.bind(this);
    this.closeModal.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", () => {
    this.assignProjectsToState({ refresh: true });
  });

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Retrieve project list from API and assign to state.
  assignProjectsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn && this._isMounted) && (!this.state.projectsList || opts.refresh)) {
      ApiCalls.getProjects().then(apiResults => {
        apiResults.forEach(result => {
          result.modalVisible = false;
          result.key = result.uid.toString() + "_" + result.modalVisible.toString();
        });
        this.setState({
          projectsList: apiResults
        });
      }, error => {
        HandleError.handleError(this, error);
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (this.state && this.state.projectsList) {
      return true;
    } else {
      return false;
    }
  }

  // Handles the onClick event for the modal buttons.
  onModalButtonClick(projectData, buttonText) {
    this.closeModal(projectData);
    if (buttonText === "Project Info") {
      return this.props.navigation.navigate("ProjectInfo", { uid: projectData.uid });
    } else {
      return this.props.navigation.navigate("Requirements", { uid: projectData.uid });
    }
  }

  // Closes the modal.
  closeModal(projectData) {
    projectData.modalVisible = false;
    if (this._isMounted) {
      this.setState(JSON.parse(JSON.stringify(this.state)));
    }
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
        <_Header
          title="Projects"
          leftIcon="menu"
          onPress={{
            left: this.props.navigation.openDrawer,
            add: () => { this.props.navigation.navigate("CreateProject", { action: "create" }); },
            refresh: () => { this.assignProjectsToState({ refresh: true }); }
          }}
        />
        {this._renderBody()}
      </Container>
    );
  }

  // Render loading screen
  _renderLoadingScreen() {
    return (
      <Content padder>
        <Spinner color="blue" />
      </Content>
    );
  }

  // Render Body
  _renderBody() {
    if (this.getRenderFromState()) {
      return (
        <Content padder>
          {this.state.ApiErrors ? <_DisplayError ApiErrorsList={this.state.ApiErrors} /> :
            <FlatList
              style={styles.container}
              data={this.state.projectsList}
              renderItem={data => this._renderProjectData(data.item)}
            />
          }
        </Content>
      );
    } else {
      return this._renderLoadingScreen();
    }
  }

  // Render Project Data
  _renderProjectData(projectData) {
    return (
      <TouchableOpacity style={styles.projectItem} onPress={() => {
        projectData.modalVisible = true;
        if (this._isMounted) {
          this.setState(JSON.parse(JSON.stringify(this.state)));
        }
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
