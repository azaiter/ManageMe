import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  Icon,
  View,
} from "native-base";
import styles from "./styles";
import {
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import {
  ManageMe_Header,
  ManageMe_LoadingScreen,
  ManageMe_DisplayError,
  ManageMe_Modal,
} from "../../util/Render";
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
    this.assignProjectsToState();
    Auth.userHasPermission.bind(this);
    this.getRenderFromState.bind(this);
    this._renderBody.bind(this);
    this._renderProjectData.bind(this);
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
    if ((this.state && this._isMounted) && (!this.state.projectsList || opts.refresh)) {
      this.setState({
        projectsList: undefined,
        getProjects: undefined
      });
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
        Alert.alert("Error!",
          JSON.stringify(this.state.getProjects || this.state.Error),
          (this.state.Error ?
            [{
              text: "OK", onPress: () => {
                this.assignProjectsToState({ refresh: true });
              }
            }] : null
          ), { cancelable: false }
        );
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (this.state && (this.state.projectsList || this.state.getProjects$)) {
      return true;
    } else {
      return false;
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

  // Modal Set State.
  modalSetstate = async (projectData) => {
    if (this._isMounted) {
      projectData.modalVisible = !projectData.modalVisible;
      this.setState(JSON.parse(JSON.stringify(this.state)));
    }
  }

  // Render
  render() {
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="Projects"
          leftIcon="menu"
          onPress={{
            left: () => this.props.navigation.openDrawer(),
            add: () => { this.props.navigation.navigate("CreateProject", { action: "create" }); },
            refresh: () => { this.assignProjectsToState({ refresh: true }); }
          }}
        />
        {this._renderBody()}
      </Container>
    );
  }

  // Render Body
  _renderBody() {
    if (this.getRenderFromState()) {
      return (
        <Content padder>
          {this.state.getProjects ?
            <ManageMe_DisplayError
              ApiErrors={this.state.getProjects}
            /> :
            <FlatList
              style={styles.container}
              data={this.state.projectsList}
              renderItem={data => this._renderProjectData(data.item)}
            />
          }
        </Content>
      );
    } else {
      return <ManageMe_LoadingScreen />;
    }
  }

  // Render Project Data
  _renderProjectData(projectData) {
    return (
      <TouchableOpacity style={styles.projectItem} onPress={() =>
        this.modalSetstate(projectData)
      }>
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
        <ManageMe_Modal
          data={projectData}
          button={
            [
              {
                text: "Project Info",
                onPress: () => {
                  this.props.navigation.navigate("ProjectInfo", { uid: projectData.uid });
                  this.modalSetstate(projectData);
                }
              },
              {
                text: "Requirements",
                onPress: () => {
                  this.props.navigation.navigate("Requirements", { uid: projectData.uid });
                  this.modalSetstate(projectData);
                }
              }
            ]
          }
          onPress={{ modal: () => this.modalSetstate(projectData) }}
        />
      </TouchableOpacity>
    );
  }
}

export default Projects;
