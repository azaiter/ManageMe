import React from "react";
import {
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon,
} from "native-base";

export function ManageMe_Header(props) {
  /*
  props = {
    title: "title",
    leftIcon: "leftIcon",
    onPress: {
        left: () => { console.log("do stuff"); },
        refresh: () => { console.log("do stuff"); },
        add: () => { console.log("do stuff"); }
    }
  };
  */
  return (
    <Header hasTabs>
      <Left>
        <Button
          transparent
          onPress={props.onPress.left} // this changes
        >
          <Icon name={props.leftIcon} />
        </Button>
      </Left>
      <Body>
        <Title>{props.title}</Title>
      </Body>
      <Right>
        {
          props.onPress.add ? 
            <ManageMe_BackButton onPress={props.onPress.add}>
            </ManageMe_BackButton> : null}
        {props.onPress.refresh ?
          <Button
              transparent
              onPress={props.onPress.refresh}
            >
            <Icon name="ios-refresh-circle" />
          </Button>
          : null
        }
      </Right>
    </Header>
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