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
  View,
} from "native-base";
import { FlatList, TouchableOpacity } from "react-native";
import styles from "./styles";
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
    this._renderHeader.bind(this);
    this._renderContent.bind(this);
    this._renderPermissionData.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", payload => {
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
        {this._renderHeader()}
        {this._renderContent()}
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
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>My Permissions</Title>
        </Body>
        <Right>
          <Button
            transparent
            onPress={() => Auth.getPermissions.bind(this)}
          >
            <Icon name="ios-refresh-circle" />
          </Button>
        </Right>
      </Header>
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
