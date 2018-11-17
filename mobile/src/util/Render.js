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

export function _header(opts) {
  /*
  let opts = {
    title: "title",
    leftIcon: "leftIcon",
    onPress: {
        left: () => { console.log("do stuff"); },
        refresh: () => { console.log("do stuff"); },
        add: () => { console.log("do stuff"); }
    }
  };
  */
  if (!opts.onPress) {
    opts.onPress = {};
  }
  return (
    <Header hasTabs>
      <Left>
        <Button
          transparent
          onPress={opts.onPress.left} // this changes
        >
          <Icon name={opts.leftIcon} />
        </Button>
      </Left>
      <Body>
        <Title>{opts.title}</Title>
      </Body>
      <Right>
        {opts.onPress.add ?
          <Button
            transparent
            onPress={opts.onPress.add}
          >
            <Icon name="ios-add-circle" />
          </Button>
          : null
        }
        {opts.onPress.refresh ?
          <Button
              transparent
              onPress={opts.onPress.refresh}
            >
            <Icon name="ios-refresh-circle" />
          </Button>
          : null
        }
      </Right>
    </Header>
  );
}
