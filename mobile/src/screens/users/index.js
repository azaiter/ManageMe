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
import { TouchableOpacity, FlatList, Alert, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class Users extends Component {
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
    this.closeModal.bind(this);
    this.goToUserInfo.bind(this);
    this._renderModal.bind(this);
    this._renderHeader.bind(this);
    this._renderModalButton.bind(this);
    this._renderBody.bind(this);
    this._renderUserData.bind(this);
    this.onSelectedItemsChange.bind(this);
    this._renderPermissionsSelector.bind(this);
  }

  onSelectedItemsChange = (userData, selectedItems) => {
    let removed = this.state[`user_${userData.uid}_perms`].filter(x=>!selectedItems.includes(x));
    let added = selectedItems.filter(x=>!this.state[`user_${userData.uid}_perms`].includes(x));
    for (let i = 0; i < removed.length; i++) {
      const permissionID = removed[i];
      ApiCalls.revokePrivilage(permissionID, userData.uid).then(res=>{
        ApiCalls.handleAPICallResult(res, this).then(apiResults => {
        });
      });
    }
    for (let i = 0; i < added.length; i++) {
      const permissionID = added[i];
      ApiCalls.assignPrivilage(permissionID, userData.uid).then(res=>{
        ApiCalls.handleAPICallResult(res, this).then(apiResults => {
        });
      });
    }
    this.setState({
      [`user_${userData.uid}_perms`]: selectedItems
    });
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
    this.assignUsersToState({ refresh: true });
  });

  // Retrieve user list from API and assign to state.
  assignUsersToState(opts = { refresh: false }) {
    if ((this.state && this.state.loggedIn) && (!this.state.usersList || opts.refresh)) {
      ApiCalls.getUserInfo().then(response => {
        ApiCalls.handleAPICallResult(response, this).then(apiResults => {
          if (apiResults) {
            apiResults.forEach(result => {
              result.modalVisible = false;
              result.key = result.uid.toString() + "_" + result.modalVisible.toString();
            });
            ApiCalls.getAllPerms().then(response2 => {
              ApiCalls.handleAPICallResult(response2, this).then(apiResults2 => {
                let allPermissions = [
                  {
                    name: "Permissions",
                    id: 0,
                    children: apiResults2.map(x=>{return {name:x.label, id:x.value};})
                  }
                ];
                let setStateObj = {
                  usersList: apiResults.map(x=>{
                    x.permissions = x.permissions.map(y=>y.uid);
                    return x;
                  }),
                  allPermissions: allPermissions
                };
                for (let i = 0; i < setStateObj.usersList.length; i++) {
                  const userObj = setStateObj.usersList[i];
                  setStateObj[`user_${userObj.uid}_perms`] = userObj.permissions;
                }
                this.setState(setStateObj);
              });
            });
          }
        });
      });
    }
  }

  // Retrieve user list from state.
  getUsersFromState() {
    if (this.state && this.state.usersList) {
      return this.state.usersList;
    } else {
      return [];
    }
  }

  // Handles the onClick event for the modal buttons.
  onModalButtonClick(userData, buttonText) {
    this.closeModal(userData);
    if (buttonText === "User Info") {
      return this.props.navigation.navigate("UserInfo");
    } else {
      return this.props.navigation.navigate("Requirements");
    }
  }

  // Closes the modal.
  closeModal(userData) {
    userData.modalVisible = false;
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
    this.assignUsersToState();
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
          <Title>Users</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => this.props.navigation.navigate("AddUser")}
          >
            <Icon name="ios-add-circle" />
          </Button>
          <Button
            transparent
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name="ios-arrow-dropleft-circle" />
          </Button>
          <Button
            transparent
            onPress={() => this.assignUsersToState({ refresh: true })}
          >
            <Icon name="ios-refresh-circle" />
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
          data={this.getUsersFromState()}
          renderItem={data => this._renderUserData(data.item)}
          extraData={this.state}
        />
      </Content>
    );
  }

  _renderPermissionsSelector(userData){
    let selectedDataHandler = (y)=> {
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
          onSelectedItemsChange={ selectedDataHandler }
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
      <TouchableOpacity style={[styles.userItem]} onPress={() => {
        userData.modalVisible = true;
        this.setState(JSON.parse(JSON.stringify(this.state)));
      }}>
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
        {this._renderModal(userData)}
      </TouchableOpacity>
    );
  }

  // Render Modal
  // @TODO: Implement proper buttons menu and polish the UI
  _renderModal(userData) {
    return (
      <TouchableWithoutFeedback onPress={() => this.closeModal(userData) }>
        <Modal
          onBackdropPress={() => this.closeModal(userData)}
          onBackButtonPress={() => this.closeModal(userData) }
          onSwipe={() => this.closeModal(userData)}
          swipeDirection="down"
          isVisible={userData.modalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{userData.name}</Text>
            <View style={styles.modalFlex}>
              {this._renderModalButton(userData, "User Info", ()=>{this.goToUserInfo(userData);})}
              {this._renderModalButton(userData, userData.enabled ? "Disable User" : "Enable User", ()=>{this.enableDisableUser(userData);})}
            </View>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }

  // Render Modal Button
  // @TODO: Implement OnClose
  _renderModalButton(userData, buttonText, functionToExec = false) {
    return (
      <TouchableOpacity style={styles.modalButton} onPress={
        functionToExec ? functionToExec : () => { this.onModalButtonClick(userData, buttonText); }
        }>
        <Text style={styles.modalText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  }

  goToUserInfo(userData){
    return;
  }
  enableDisableUser(userData){
    let enabled = userData.enabled ? 0 : 1;
    ApiCalls.enabledDisableUser(userData.uid, enabled).then(response => {
      ApiCalls.handleAPICallResult(response, this).then(apiResults => {
        if (apiResults) {
          Alert.alert("Success", `User has been ${enabled ? "enabled" : "disabled"}!`,
          [
            {text: "OK", onPress: () => {
              this.closeModal(userData);
              this.assignUsersToState({ refresh: true });
            }},
          ],
          { cancelable: false });
        }
      });
    });
  }
}

export default Users;
