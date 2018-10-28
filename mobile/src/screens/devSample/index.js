import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Text,
  ListItem,
  List
} from "native-base";

const datasDev = [
  {
    text: "Actionsheet",
    route: "Actionsheet",
  },
  {
    text: "Header",
    route: "Header",
  },
  {
    text: "Footer",
    route: "Footer",
  },
  {
    text: "Badge",
    route: "NHBadge",
  },
  {
    text: "Button",
    route: "NHButton",
  },
  {
    text: "Card",
    route: "NHCard",
  },
  {
    text: "Check Box",
    route: "NHCheckbox",
  },
  {
    text: "Deck Swiper",
    route: "NHDeckSwiper",
  },
  {
    text: "Fab",
    route: "NHFab",
  },
  {
    text: "Form & Inputs",
    route: "NHForm",
  },
  {
    text: "Icon",
    route: "NHIcon",
  },
  {
    text: "Layout",
    route: "NHLayout",
  },
  {
    text: "List",
    route: "NHList",
  },
  {
    text: "ListSwipe",
    route: "ListSwipe",
  },
  {
    text: "Picker",
    route: "NHPicker",
  },
  {
    text: "Radio",
    route: "NHRadio",
  },
  {
    text: "SearchBar",
    route: "NHSearchbar",
  },
  {
    text: "Segment",
    route: "Segment",
  },
  {
    text: "Spinner",
    route: "NHSpinner",
  },
  {
    text: "Tabs",
    route: "NHTab",
  },
  {
    text: "Thumbnail",
    route: "NHThumbnail",
  },
  {
    text: "Toast",
    route: "NHToast",
  },
  {
    text: "Typography",
    route: "NHTypography",
  }
];

class DevSample extends Component {
  // eslint-disable-line

  render() {
    return (
      <Container style={{ backgroundColor: "#FFF" }}>
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
            <Title>Development Sample</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <List
            dataArray={datasDev}
            renderRow={data =>
              <ListItem
                button
                onPress={() => this.props.navigation.navigate(data.route)}
              >
                <Left>
                  <Text>
                    {data.text}
                  </Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" style={{ color: "#999" }} />
                </Right>
              </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

export default DevSample;
