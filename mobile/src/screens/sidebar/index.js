import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Body,
  Row,
  Col,
} from "native-base";
import styles from "./styles";
const Auth = require("../../util/Auth");
const drawerCover = require("../../../assets/drawer-cover.png");
const drawerImage = require("../../../assets/logo-kitchen-sink.png");
const UserInfo = require("../../components/UserInfo");
var pjson = require("../../../package.json");

const dataOnlyLogin = [
  {
    name: "Login",
    route: "Home",
    icon: "ios-log-in",
    bg: "#C5F442"
  }
];

const dataLogout =
{
  name: "Logout",
  route: false,
  action: "logout",
  icon: "ios-log-out",
  bg: "#C5F442"
}
  ;

const datas = [
  {
    name: "Projects",
    route: "Projects",
    icon: "ios-browsers-outline",
    bg: "#C5F442"
  },
  {
    name: "Teams",
    route: "Teams",
    icon: "ios-people",
    bg: "#C5F442"
  },
  {
    name: "My Permissions",
    route: "Permissions",
    icon: "ios-wifi",
    bg: "#C5F442"
  },
  {
    name: "Users",
    route: "Users",
    icon: "ios-contact",
    bg: "#C5F442",
    permissionID: 24
  },
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
    Auth.userHasPermission.bind(this);
  }

  handleAction = async (actionType) => {
    switch (actionType) {
      case "logout":
        await Auth.logout(this);
        Auth.setIsLoginStateOnScreenEntry(this);
        break;
      default:
        break;
    }
  }

  handleNavigation = (screen) => {
    this.props.navigation.navigate(screen);
  }

  handleSideBarDataObj = (data) => {
    if (data.route) {
      this.handleNavigation(data.route);
    }
    else if ("action" in data && data.action) {
      this.handleAction(data.action);
    }
  }

  render() {
    Auth.setIsLoginStateOnScreenEntry(this, { dontGoHome: true, setUserPermissions: true });
    // here you add permissions logic to edit menu if needed
    let dataListToShow = [];
    if (this.state.loggedIn) {
      dataListToShow = datas.filter(x => {
        return ((x.permissionID && Auth.userHasPermission(this, x.permissionID)) || !("permissionID" in x));
      });
    }
    else {
      dataListToShow = dataOnlyLogin;
    }
    return (
      <Container>
        <Content
          bounces={false}
        >
          <Row style={styles.header}>
            <Body>
              <Image source={drawerCover} style={styles.drawerCover} />
              {
                this.state.loggedIn ?
                  <UserInfo
                    style={styles.userInfo}
                    username={this.state.userTokenObj.first_name + " " + this.state.userTokenObj.last_name}
                    email={this.state.userTokenObj.email}
                  /> :
                  <Image square style={styles.drawerImage} source={drawerImage} />
              }
            </Body>
          </Row>
          <Row style={styles.body}>
            <List
              dataArray={dataListToShow}
              renderRow={data =>
                <ListItem button noBorder onPress={() => this.handleSideBarDataObj(data)}>
                  <Icon active name={data.icon} style={styles.icon} />
                  <Text style={styles.text}>{data.name}</Text>
                </ListItem>}
            />
          </Row>
          {
            this.state.loggedIn ?
              <Row style={styles.logout}>
                <ListItem button noBorder onPress={() => this.handleSideBarDataObj(dataLogout)}>
                  <Icon active name={dataLogout.icon} style={styles.footerIcon} />
                  <Text style={styles.footerText}>{dataLogout.name}</Text>
                </ListItem>
              </Row> :
              null
          }
          <Row style={styles.rowVersion}>
            <Col style={styles.colVersion}>
              <Text style={styles.textVersion}>Version: {pjson.version}</Text>
            </Col>
            <Col style={styles.colTerms}>
              <Text>|</Text>
            </Col>
            <Col style={styles.colVersion}>
              <TouchableOpacity onPress={() => null }><Text style={styles.textVersion}>Privacy & Terms</Text></TouchableOpacity>
            </Col>
          </Row>
        </Content>
      </Container>
    );
  }
}

export default SideBar;
