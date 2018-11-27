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
import {
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import {
  ManageMe_Header,
  ManageMe_Modal,
} from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Users extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "Users",
      setUserPermissions: true
    });
    Auth.userHasPermission.bind(this);
    this.assignUsersToState.bind(this);
    this.enableDisableUser.bind(this);
    this._renderBody.bind(this);
    this._renderUserData.bind(this);
    this.onSelectedItemsChange.bind(this);
    this._renderPermissionsSelector.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
    this.assignUsersToState({ refresh: true });
  });

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSelectedItemsChange = (userData, selectedItems) => {
    let removed = this.state[`user_${userData.uid}_perms`].filter(x => !selectedItems.includes(x));
    let added = selectedItems.filter(x => !this.state[`user_${userData.uid}_perms`].includes(x));
    for (let i = 0; i < removed.length; i++) {
      const permissionID = removed[i];
      ApiCalls.revokePrivilage(permissionID, userData.uid).then(res => {
        ApiCalls.handleAPICallResult(res, this).then(apiResults => {
        });
      });
    }
    for (let i = 0; i < added.length; i++) {
      const permissionID = added[i];
      ApiCalls.assignPrivilage(permissionID, userData.uid).then(res => {
        ApiCalls.handleAPICallResult(res, this).then(apiResults => {
        });
      });
    }
    if (this._isMounted) {
      this.setState({
        [`user_${userData.uid}_perms`]: selectedItems
      });
    }
  }

  // Retrieve user list from API and assign to state.
  assignUsersToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.usersList || opts.refresh)) {
      ApiCalls.getUserInfo().then(response => {
        if (this._isMounted) {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            if (apiResults) {
              apiResults.forEach(result => {
                result.modalVisible = false;
                result.key = result.uid.toString() + "_" + result.modalVisible.toString();
              });
              ApiCalls.getAllPerms().then(_response => {
                ApiCalls.handleAPICallResult(_response, this).then(_apiResults => {
                  if (_apiResults) {
                    let allPermissions = [
                      {
                        name: "Permissions",
                        id: 0,
                        children: _apiResults.map(x => { return { name: x.label, id: x.value }; })
                      }
                    ];
                    let setStateObj = {
                      usersList: apiResults.map(x => {
                        x.permissions = x.permissions.map(y => y.uid);
                        return x;
                      }),
                      allPermissions: allPermissions
                    };
                    for (let i = 0; i < setStateObj.usersList.length; i++) {
                      const userObj = setStateObj.usersList[i];
                      setStateObj[`user_${userObj.uid}_perms`] = userObj.permissions;
                    }
                    this.setState(setStateObj);
                  } else {
                    this.setState({
                      setStateObj: "null"
                    });
                  }
                });
              });
            } else {
              this.setState({
                usersList: "null"
              });
            }
          });
        }
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (this.state && this.state.usersList) {
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
  modalSetstate = async (userData) => {
    if (this._isMounted) {
      userData.modalVisible = !userData.modalVisible;
      this.setState(JSON.parse(JSON.stringify(this.state)));
    }
  }

  // Render
  render() {
    this.assignUsersToState();
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="Users"
          leftIcon="menu"
          onPress={{
            left: () => this.props.navigation.openDrawer(),
            add: () => { this.props.navigation.navigate("CreateUser", { action: "create" }); },
            refresh: () => { this.assignUsersToState({ refresh: true }); }
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
          {this.state.usersList === "null" ?
            <View style={styles.warningView} >
              <Icon style={styles.warningIcon} name="warning" />
              <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
            </View> :
            <FlatList
              style={styles.container}
              data={this.state.usersList}
              renderItem={data => this._renderUserData(data.item)}
              extraData={this.state}
            />
          }
        </Content>
      );
    } else {
      return this._renderLoadingScreen();
    }
  }

  _renderPermissionsSelector(userData) {
    let selectedDataHandler = (y) => {
      this.onSelectedItemsChange(userData, y);
    };
    return (
      <View>
        <SectionedMultiSelect
          items={this.state.allPermissions}
          uniqueKey="id"
          subKey="children"
          selectText="Choose permissions..."
          searchPlaceholderText="Search..."
          showChips={false}
          onSelectedItemsChange={selectedDataHandler}
          selectedItems={this.state[`user_${userData.uid}_perms`]}
          readOnlyHeadings={true}
          style={{
            selectToggle: {
              width: "100%",
            },
          }}
        />
      </View>
    );
  }

  // Render User Data
  _renderUserData(userData) {
    return (
      <TouchableOpacity style={[styles.userItem]} onPress={() =>
        this.modalSetstate(userData)
      }>
        <View style={styles.text}>
          <Text style={[styles.title, styles["userListEnabled" + userData.enabled]]}>{userData.first_name} {userData.last_name}</Text>
          <Text style={styles.body}> Username: {userData.username} </Text>
          <Text style={styles.body}> Email: {userData.email} </Text>
          <Text style={styles.body}> Phone #: {userData.phone} </Text>
          <Text style={styles.body}> Hourly Wage: ${userData.wage} </Text>
          <Text style={styles.body}> Address: {userData.address} </Text>
          <View style={styles.flex}>
            <Icon style={styles.time} name="time" />
            <Text style={styles.time}>
              {"  "}{userData.created}
            </Text>
          </View>
          {this._renderPermissionsSelector(userData)}
        </View>
        <Icon style={styles.icon} name="more" />
        <ManageMe_Modal
          data={userData}
          button={
            [
              Auth.userHasPermission(this, 11) ?
                {
                  text: "Edit User",
                  onPress: () => {
                    this.props.navigation.navigate("CreateUser", { action: "edit", userData: userData });
                    this.modalSetstate(userData);
                  }
                } : null,
              {
                text: userData.enabled ? "Disable User" : "Enable User",
                onPress: () => { this.enableDisableUser(userData); }
              }
            ]
          }
          onPress={{ modal: () => this.modalSetstate(userData) }}
        />
      </TouchableOpacity>
    );
  }

  enableDisableUser(userData) {
    let enabled = userData.enabled ? 0 : 1;
    ApiCalls.enabledDisableUser(userData.uid, enabled).then(response => {
      ApiCalls.handleAPICallResult(response, this).then(apiResults => {
        if (apiResults) {
          Alert.alert("Success", `"${userData.first_name} ${userData.last_name}"  has been ${enabled ? "enabled" : "disabled"}!`,
            [
              {
                text: "OK", onPress: () => {
                  this.assignUsersToState({ refresh: true });
                }
              },
            ],
            { cancelable: false });
        }
      });
    });
  }
}

export default Users;
