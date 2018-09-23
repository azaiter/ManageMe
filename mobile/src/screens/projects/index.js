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
import { TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, { navigate: "Projects" });
  }

  // Retrieve project list from API and assign to state.
  assignProjectsToState(opts={refresh:false}){
    if (!this.state.projectsList || opts.refresh){
      ApiCalls.getProjects().then(response=>{
        ApiCalls.handleAPICallResult(response).then(apiResults=>{
          if (apiResults){
            apiResults.forEach(result => {
              result.modalVisible = false;
              result.key = result.uid.toString()+"_"+result.modalVisible.toString(); 
            });
            this.setState({
              projectsList:apiResults
            });
          }
        });
      });
    }
  }

  // Retrieve project list from state.
  getProjectsFromState() {
    if(this.state && this.state.projectsList) {
      return this.state.projectsList;
    } else {
      return [];
    }
  }

  // Handles the onClick event for the modal buttons.
  onModalButtonClick(projectData,buttonText) {
    // @TODO: Implement Button Events
    this.closeModal(projectData);
  }

  // Closes the modal.
  closeModal(projectData) {
    projectData.modalVisible = false;
    this.setState(JSON.parse(JSON.stringify(this.state)));
  }
  
  // Reduces text to 40 characters.
  truncate(text) { 
    if(text.length > 40) {
      return `${text.substr(0, 40)}...`;
    } else {
      return text;
    }
  }

  // Render
  render() {
    if (this.state && this.state.loggedIn){
      this.assignProjectsToState();
    }
    return (
      <Container style={styles.container}>
        {this._renderHeader()}
        {this._renderBody()}
      </Container>
    );
  }

  // Render Header
  _renderHeader() { return (
    <Header>
      <Left>
        <Button
          transparent
          onPress={() => thix.props.navigation.navigate("DrawerOpen")}
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
  );}

  // Render Body
  _renderBody() { return (
    <Content padder>
      <FlatList 
        style={styles.container}
        data={this.getProjectsFromState()}
        renderItem={data => this._renderProjectData(data.item)}
      />
    </Content>
  );}

  // Render Project Data
  _renderProjectData(projectData) { return (
    <TouchableOpacity style={styles.projectItem} onPress={()=> {
        projectData.modalVisible = true;
        this.setState(JSON.parse(JSON.stringify(this.state)));
      }}>
      <View style={styles.text}>
        <Text style={styles.title}>{projectData.uid} - {projectData.name}</Text>
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
  );}

  // Render Modal
  _renderModal(projectData) { return (
    <Modal isVisible={projectData.modalVisible}>
      <View style={styles.modalContent}>
        <Text>{projectData.name}</Text>
        {this._renderModalButton(projectData,"Apples")}
        {this._renderModalButton(projectData,"Banans")}
        {this._renderModalButton(projectData,"Carrots")}
      </View>
    </Modal>
  );}

  // Render Modal Button
  _renderModalButton(projectData,buttonText) { return (
    <TouchableOpacity onPress={() => { 
      this.onModalButtonClick(projectData,buttonText);
    }}>
      <View style={styles.button}>
        <Text>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );}
}

export default Projects;
