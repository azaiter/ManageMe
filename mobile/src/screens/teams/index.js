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
  ManageMe_DisplayError
} from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");
const HandleError = require("../../util/HandleError");

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
    this.assignTeamsToState();
    this.getRenderFromState.bind(this);
    this._renderBody.bind(this);
    this._renderTeamData.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", () => {
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
    if ((this.state && this._isMounted) && (!this.state.teamsList || opts.refresh)) {
      this.setState({
        teamsList: undefined,
        getTeams: undefined
      });
      ApiCalls.getTeams().then(apiResults => {
        this.setState({
          teamsList: apiResults
        });
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert("Error!",
          JSON.stringify(this.state.getTeams || this.state.Error),
          (this.state.Error ?
            [{
              text: "OK", onPress: () => {
                this.assignTeamsToState({ refresh: true });
              }
            }] : null
          ), { cancelable: false }
        );
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (this.state && (this.state.teamsList || this.state.getTeams)) {
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
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="Teams"
          leftIcon="menu"
          onPress={{
            left: () => this.props.navigation.openDrawer(),
            add: () => { this.props.navigation.navigate("CreateTeam"); },
            refresh: () => { this.assignTeamsToState({ refresh: true }); }
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
          {this.state.getTeams ?
            <ManageMe_DisplayError
              ApiErrors={this.state.getTeams}
            /> :
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
      return <ManageMe_LoadingScreen />;
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
