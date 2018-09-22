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
  List,
  ListItem
} from "native-base";
import { connect } from "react-redux";
import { listPermissions } from "../../reducers/permissions";

import styles from "./styles";
const Auth = require("../../util/Auth");
class Permissions extends Component {
  componentDidMount() {
    this.props.listPermissions(84);
  }
  // constructor(props){
  //   super(props);
  //   this.state = {};
  //   Auth.setIsLoginStateOnScreenEntry(this, {navigate:"Permissions", setUserPermissions: true});
  //   this.getPermissions.bind(this);
  // }
  getPermissions(){
    if (this.state && this.state.userPermissions){
      return this.state.userPermissions;
    }
    else {
      return [];
    }
  }
  render() {
    const { permissions } = this.props;
    return (
      <Container style={styles.container}>
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
            <Title>My Permissions</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
        <List
            dataArray={permissions}
            renderRow={data =>
              <ListItem>
                <Left>
                  <Text>
                    {data.desc}
                  </Text>
                </Left>
              </ListItem>}
          />
          <Button onPress={() => this.props.navigation.goBack()}>
            <Text>Back</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

//export default Permissions;


const mapStateToProps = state => {
  let storedPermissions = state.permissions.permissions;
  return {
    permissions: storedPermissions
  };
};

const mapDispatchToProps = {
  listPermissions
};

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
