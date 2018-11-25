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
import { TouchableOpacity, FlatList } from "react-native";
import { ManageMe_Header } from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Teams extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "Teams",
      setUserPermissions: true
    });
    Auth.userHasPermission.bind(this);
    this.assignTeamsToState.bind(this);
    this.getRenderFromState.bind(this);
    this._renderBody.bind(this);
    this._renderLoadingScreen.bind(this);
    this._renderTeamData.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
    this.assignTeamsToState({ refresh: true });
  });

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Retrieve team list from API and assign to state.
  assignTeamsToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.teamsList || opts.refresh)) {
      ApiCalls.getTeams().then(response => {
        if (this._isMounted) {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            if (apiResults) {
              apiResults.forEach(result => {
                result.modalVisible = false;
                result.key = result.uid.toString() + "_" + result.modalVisible.toString();
              });
              this.setState({
                teamsList: apiResults
              });
            } else {
              this.setState({
                teamsList: "null"
              });
            }
          });
        }
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (this.state && this.state.teamsList) {
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

  // Render
  render() {
    this.assignTeamsToState();
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="Teams"
          leftIcon="menu"
          onPress={{
            left: this.props.navigation.openDrawer,
            add: () => { this.props.navigation.navigate("CreateTeam"); },
            refresh: () => { this.assignTeamsToState({ refresh: true }); }
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
          {this.state.teamsList === "null" ?
            <View style={styles.warningView} >
              <Icon style={styles.warningIcon} name="warning" />
              <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
            </View> :
            <FlatList
              style={styles.container}
              data={this.state.teamsList}
              renderItem={data => this._renderTeamData(data.item)}
              keyExtractor={item => item.uid.toString()}
            />
          }
        </Content>
      );
    } else {
      return this._renderLoadingScreen();
    }
  }

  // Render Team Data
  _renderTeamData(teamData) {
    return (
      <TouchableOpacity style={styles.teamItem} onPress={() =>
        this.props.navigation.navigate("TeamMembers", { uid: teamData.uid })
      }>
        <View style={styles.text}>
          <Text style={styles.title}>{teamData.name}</Text>
          <View style={styles.bodyFlex}>
            <Text style={styles.body}>
              {this.truncate(teamData.desc)}
            </Text>
          </View>
        </View>
        <Icon style={styles.icon} name="more" />
      </TouchableOpacity>
    );
  }
}

export default Teams;
