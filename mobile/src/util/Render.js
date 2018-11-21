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

/*export function ManageMe_LeftButton(props) {
  return (
    <Button
      transparent
      onPress={() => { props.onPress(); }}
    >
      <Icon name={
        (props.leftButton === "back") ?
          "ios-arrow-dropleft-circle" :
          "menu"
      } />
    </Button>
  );
}

export function ManageMe_AddButton(props) {
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
}*/

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
