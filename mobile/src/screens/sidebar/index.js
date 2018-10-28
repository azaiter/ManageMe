import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge,
  Separator,
  Header,
  Body,
  Footer,
} from "native-base";
import styles from "./style";
const Auth = require("../../util/Auth");
const drawerCover = require("../../../assets/drawer-cover.png");
const drawerImage = require("../../../assets/logo-kitchen-sink.png");
const UserInfo = require("../../components/UserInfo");

const dataOnlyLogin = [
  {
    name: "Login",
    route: "Home",
    icon: "ios-log-in",
    bg: "#C5F442"
  }
];

const dataLogout = [
  {
    name: "Logout",
    route: false,
    action: "logout",
    icon: "ios-log-out",
    bg: "#C5F442"
  }
];

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

const datasDev = [
  {
    name: "DevSample",
    route: "DevSample",
    icon: "phone-portrait",
    bg: "#477EEA"
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
        <Header style={{ height: 230 }}>
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
        </Header>
        <Content
          bounces={false}
        >
          <Separator bordered>
            <Text>Dev Program</Text>
          </Separator>
          <List
            dataArray={datasDev}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.handleSideBarDataObj(data)}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
          />
          <Separator bordered>
            <Text>Main Program</Text>
          </Separator>
          <List
            dataArray={dataListToShow}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.handleSideBarDataObj(data)}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 25,
                        width: 72,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types} Types`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
          />
        </Content>
        {
          this.state.loggedIn ?
            <Footer>
              <List
                dataArray={dataLogout}
                renderRow={data =>
                  <ListItem
                    button
                    noBorder
                    onPress={() => this.handleSideBarDataObj(data)}
                  >
                    <Left>
                      <Icon
                        active
                        name={data.icon}
                        style={{ fontSize: 26, width: 30 }}
                      />
                      <Text style={styles.text}>
                        {data.name}
                      </Text>
                    </Left>
                    {data.types &&
                      <Right style={{ flex: 1 }}>
                        <Badge
                          style={{
                            borderRadius: 3,
                            height: 25,
                            width: 72,
                            backgroundColor: data.bg
                          }}
                        >
                          <Text
                            style={styles.badgeText}
                          >{`${data.types} Types`}</Text>
                        </Badge>
                      </Right>}
                  </ListItem>}
              />
            </Footer>
            :
            null
        }
      </Container>
    );
  }
}

export default SideBar;
