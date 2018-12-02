import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  View,
} from "native-base";
import { FlatList, TouchableOpacity } from "react-native";
import styles from "./styles";
import { ManageMe_Header } from "../../util/Render";
const Auth = require("../../util/Auth");
class Permissions extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {
      navigate: "Permissions",
      setUserPermissions: true
    });
    Auth.getPermissions.bind(this);
    this._renderContent.bind(this);
    this._renderPermissionData.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", () => {
    Auth.getPermissions.bind(this);
  });

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Container style={styles.container}>
        <ManageMe_Header
          title="My Permissions"
          leftIcon="menu"
          onPress={{
            left: () => this.props.navigation.openDrawer(),
            refresh: () => { Auth.getPermissions.bind(this); }
          }}
        />
        {this._renderContent()}
      </Container>
    );
  }

  // Render Content
  _renderContent() {
    return (
      <Content padder>
        <FlatList
          style={styles.container}
          data={Auth.getPermissions(this)}
          renderItem={data => this._renderPermissionData(data.item)}
          keyExtractor={item => item.uid.toString()}
        />
      </Content>
    );
  }

  // Render Team Data
  _renderPermissionData(permissionData) {
    return (
      <TouchableOpacity style={styles.permissionItem}>
        <View style={styles.text}>
          <Text style={styles.body}>{permissionData.desc}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Permissions;
