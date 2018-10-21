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

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "Teams",
      setUserPermissions: true
    });
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
    this.assignTeamsToState({ refresh: true });
  });

  // Retrieve team list from API and assign to state.
  assignTeamsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.teamsList || opts.refresh)) {
      ApiCalls.getTeams().then(response => {
        ApiCalls.handleAPICallResult(response).then(apiResults => {
          if (apiResults) {
            apiResults.forEach(result => {
              result.modalVisible = false;
              result.key = result.uid.toString() + "_" + result.modalVisible.toString();
            });
            this.setState({
              teamsList: apiResults
            });
          }
        });
      });
    }
  }

  // Retrieve team list from state.
  getTeamsFromState() {
    if (this.state && this.state.teamsList) {
      return this.state.teamsList;
    } else {
      return [];
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

  // Handles the onClick event for the modal buttons.
  onModalButtonClick(teamData, buttonText) {
    this.closeModal(teamData);
    // @TODO: Implement Button Events
    if (buttonText === "Info") {
      return this.props.navigation.navigate("TeamInfo", { uid: teamData.uid });
    } else {
      return this.props.navigation.navigate("TeamMembers", { uid: teamData.uid });
    }
  }

  // Closes the modal.
  closeModal(teamData) {
    teamData.modalVisible = false;
    this.setState(JSON.parse(JSON.stringify(this.state)));
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
    );
  }

  // Render Body
  _renderBody() {
    return (
      <Content padder>
        <FlatList
          style={styles.container}
          data={this.getTeamsFromState()}
          renderItem={data => this._renderTeamData(data.item)}
        />
      </Content>
    );
  }

  // Render Team Data
  _renderTeamData(teamData) {
    return (
      <TouchableOpacity style={styles.teamItem} onPress={() => {
        teamData.modalVisible = true;
        this.setState(JSON.parse(JSON.stringify(this.state)));
      }}>
        <View style={styles.text}>
          <Text style={styles.title}>{teamData.name}</Text>
          <Text style={styles.body}>
            {this.truncate(teamData.desc)}
          </Text>
        </View>
        <Icon style={styles.icon} name="more" />
        {this._renderModal(teamData)}
      </TouchableOpacity>
    );
  }

  // Render Modal
  _renderModal(teamData) {
    return (
      <TouchableWithoutFeedback onPress={() => this.closeModal(teamData)}>
        <Modal
          onBackdropPress={() => this.closeModal(teamData)}
          onBackButtonPress={() => this.closeModal(teamData)}
          onSwipe={() => this.closeModal(teamData)}
          swipeDirection="down"
          isVisible={teamData.modalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{teamData.name}</Text>
            <View style={styles.modalFlex}>
              {this._renderModalButton(teamData, "Info")}
              {this._renderModalButton(teamData, "Members")}
            </View>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }

  // Render Modal Button
  _renderModalButton(teamData, buttonText) {
    return (
      <TouchableOpacity style={styles.modalButton} onPress={() => {
        this.onModalButtonClick(teamData, buttonText);
      }}>
        <Text style={styles.modalText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  }
}

export default Teams;
