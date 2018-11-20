import React from "react";
import {
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text
} from "native-base";

/** HEADER **/
export function ManageMe_Header(props) {
  return (
    <Header hasTabs>
      <Left>
        <ManageMe_LeftButton />
      </Left>
      <Body>
        <Title>{props.title}</Title>
      </Body>
      <Right>
        { props.onPress.add     ? <ManageMe_BackButton    onPress={props.onPress.add    }/> : null }
        { props.onPress.refresh ? <ManageMe_RefreshButton onPress={props.onPress.refresh}/> : null }
      </Right>
    </Header>
  );
}

export function ManageMe_LeftButton(props) {
  return (
    <Button
      transparent
      onPress={props.onPress.left}
    >
      <Icon name={
        (props.leftButton === "back") ?
          "ios-arrow-dropleft-circle" :
          "ios-arrow-dropleft-circle"
      }/>
    </Button>
  );
}

export function ManageMe_BackButton(props) {
  return (
    <Button
      transparent
      onPress={props.onPress.add}
    >
      <Icon name="ios-add-circle" />
    </Button>
  );
}

export function ManageMe_RefreshButton(props) {
  return (
    <Button
      transparent
      onPress={props.onPress.refresh}
    >
      <Icon name="ios-refresh-circle" />
    </Button>
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
