import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "native-base";

import UserAvatar from "react-native-user-avatar";
import styles from "./styles";

class UserInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={this.props.style}>
        <UserAvatar size="80" name={this.props.username} />
        <Text />
        <Text style={styles.textUser}>{this.props.username}</Text>
        <Text style={styles.textUser}>{this.props.email}</Text>
      </View>
    );
  }
}

module.exports = UserInfo;
