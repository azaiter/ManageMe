import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "native-base";

import UserAvatar from "react-native-user-avatar";

class UserInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={this.props.style}>
                <UserAvatar size="100" name={this.props.username} />
                <Text>{this.props.username}</Text>
                <Text>{this.props.email}</Text>
            </View>
        );
    }
}

module.exports = UserInfo;
