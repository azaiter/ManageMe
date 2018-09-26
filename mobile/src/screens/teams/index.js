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

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "Teams",
      setUserPermissions: true
    });
  }

  // Retrieve team list from API and assign to state.
  assignTeamsToState(opts={refresh:false}){
    if ((this.state && this.state.loggedIn) && (!this.state.teamsList || opts.refresh)){
      ApiCalls.getTeams().then(response=>{
        ApiCalls.handleAPICallResult(response).then(apiResults=>{
          if (apiResults){
            apiResults.forEach(result => {
              result.modalVisible = false;
              result.key = result.uid.toString()+"_"+result.modalVisible.toString(); 
            });
            this.setState({
              teamsList:apiResults
            });
          }
        });
      });
    }
  }

  // Retrieve team list from state.
  getTeamsFromState() {
    if(this.state && this.state.teamsList) {
      return this.state.teamsList;
    } else {
      return [];
    }
  }

  // Handles the onClick event for the modal buttons.
  onModalButtonClick(teamData,buttonText) {
    // @TODO: Implement Button Events
    this.closeModal(teamData);
  }

  // Closes the modal.
  closeModal(teamData) {
    teamData.modalVisible = false;
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
    this.assignTeamsToState();
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
          onPress={() => this.props.navigation.navigate("DrawerOpen")}
        >
          <Icon name="menu" />
        </Button>
      </Left>
      <Body>
        <Title>Teams</Title>
      </Body>
      <Right style={styles.flex}>
        <Button
          transparent
          onPress={() => this.props.navigation.navigate("CreateTeam")}
        >
          <Icon name="add" />
        </Button>
        <Button
          transparent
          onPress={() => this.assignTeamsToState({ refresh: true })}
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
        data={this.getTeamsFromState()}
        renderItem={data => this._renderTeamData(data.item)}
      />
    </Content>
  );}

  // Render Team Data
  _renderTeamData(teamData) { return (
    <TouchableOpacity style={styles.teamItem} onPress={()=> {
        teamData.modalVisible = true;
        this.setState(JSON.parse(JSON.stringify(this.state)));
      }}>
      <View style={styles.text}>
        <Text style={styles.title}>{teamData.uid} - {teamData.name}</Text>
        <Text style={styles.body}>
          {this.truncate(teamData.desc)}
        </Text>
        <View style={styles.flex}>
          <Icon style={styles.time} name="time" />
          <Text style={styles.time}>
            {"  "}{teamData.created}
          </Text>
        </View>
      </View>
      <Icon style={styles.icon} name="more" />
      {this._renderModal(teamData)}
    </TouchableOpacity>
  );}

  // Render Modal
  // @TODO: Implement proper buttons menu and polish the UI
  _renderModal(teamData) { return (
    <Modal isVisible={teamData.modalVisible}>
      <View style={styles.modalContent}>
        <Text>{teamData.name}</Text>
        {this._renderModalButton(teamData,"Apples")}
        {this._renderModalButton(teamData,"Banans")}
        {this._renderModalButton(teamData,"Carrots")}
      </View>
    </Modal>
  );}

  // Render Modal Button
  // @TODO: Implement OnClose
  _renderModalButton(teamData,buttonText) { return (
    <TouchableOpacity onPress={() => { 
      this.onModalButtonClick(teamData,buttonText);
    }}>
      <View style={styles.button}>
        <Text>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );}
}

export default Teams;
