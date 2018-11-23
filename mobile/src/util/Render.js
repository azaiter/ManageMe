import React from "react";
import {
  StyleSheet,
  Header,
  Title,
  View,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text
} from "native-base";

/** STYLESHEET **/
const styles = StyleSheet.create({
  warningIcon: {
    fontSize: 40,
    color:"orange"
  },

  warningText: {
    fontWeight: "bold",
    fontSize: 22,
    color:"orange"
  },

  warningView: {
    alignItems:"center"
  },
});

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

/** BODY **/
export function ManageMe_Body(props) {
  return (
    <Text>Not Yet Implemented</Text>
  );
}

export function ManageMe_DisplayError(props) {
  return (
    <View style={styles.warningView} >
      <Icon style={styles.warningIcon} name="warning" />
      <Text style={styles.warningText}>{props.ApiErrorsList}</Text>
    </View>
  );
}

/** MODAL **/
export function ManageMe_Modal(props) {
  return (
    <Text>Not Yet Implemented</Text>
  );
}
