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
                <UserAvatar size="80" name={this.props.username} />
                <Text />
                <Text style={{fontSize: 20, fontWeight: "bold" , color: "#008000"}}>{this.props.username}</Text>
                <Text style={{fontSize: 17, fontWeight: "bold" , color: "#008000"}}>{this.props.email}</Text>
            </View>
        );
    }
}

module.exports = UserInfo;
