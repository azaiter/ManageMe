import React from "react";
import {
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Content,
  Spinner,
  View,
} from "native-base";

/** HEADER **/
export function ManageMe_Header(props) {
  return (
    <Header hasTabs>
      <Left>
        <ManageMe_Button
          onPress={props.onPress.left}
          iconName={
            (props.leftIcon === "back") ?
              "ios-arrow-dropleft-circle" :
              "menu"
          }
        />
      </Left>
      <Body>
        <Title>{props.title}</Title>
      </Body>
      <Right>
        {props.onPress.add ?
          <ManageMe_Button
            onPress={props.onPress.add}
            iconName="ios-add-circle"
          />
          : null
        }
        {props.onPress.refresh ?
          <ManageMe_Button
            onPress={props.onPress.refresh}
            iconName="ios-refresh-circle"
          />
          : null
        }
      </Right>
    </Header>
  );
}

export function ManageMe_Button(props) {
  return (
    <Button
      transparent
      onPress={() => { props.onPress(); }}
    >
      <Icon name={props.iconName} />
    </Button>
  );
}

/** LOADING SCREEN **/
export function ManageMe_LoadingScreen() {
  return (
    <Content padder>
      <Spinner color="blue" />
    </Content>
  );
}

/** DISPLAY ERROR **/
export function ManageMe_DisplayError(props) {
  return (
    <View style={{ alignItems: "center" }} >
      <Icon style={{ fontSize: 60, color: "red" }} name="ios-close-circle" />
      <Text style={{ fontWeight: "bold", fontSize: 22, color: "red" }}>{props.ApiErrorsList}</Text>
    </View>
  );
}

/** BODY **/
export function ManageMe_Body(props) {
  return (
    <Text>Not Yet Implemented</Text>
  );
}

/** MODAL **/
export function ManageMe_Modal(props) {
  return (
    <Text>Not Yet Implemented</Text>
  );
}
