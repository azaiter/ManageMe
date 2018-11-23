import React from "react";
import {
  Header,
  Title,
  View,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Content,
  Spinner
} from "native-base";

import { TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

/** HEADER **/
export function _Header(props) {
  return (
    <Header hasTabs>
      <Left>
        <_Button
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
          <_Button
            onPress={props.onPress.add}
            iconName="ios-add-circle"
          />
          : null
        }
        {props.onPress.refresh ?
          <_Button
            onPress={props.onPress.refresh}
            iconName="ios-refresh-circle"
          />
          : null
        }
      </Right>
    </Header>
  );
}

export function _Button(props) {
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
export function _Body(props) {
  return (
    <Text>Not Yet Implemented</Text>
  );
}

/** LOADING SCREEN **/
export function _LoadingScreen() {
  return (
    <Content padder>
      <Spinner color="blue" />
    </Content>
  );
}

/** DISPLAY ERROR **/
export function _DisplayError(props) {
  return (
    <View style={{ alignItems: "center" }} >
      <Icon style={{ fontSize: 60, color: "red" }} name="ios-close-circle" />
      <Text style={{ fontWeight: "bold", fontSize: 22, color: "red" }}>{props.ApiErrorsList}</Text>
    </View>
  );
}

/** MODAL **/
export function _Modal(props) {
  return (
    <TouchableWithoutFeedback onPress={props.onPress.modal}>
      <Modal
        onBackdropPress={props.onPress.modal}
        onBackButtonPress={props.onPress.modal}
        onSwipe={props.onPress.modal}
        swipeDirection="down"
        isVisible={props.Data.modalVisible}>
        <View style={{ padding: 22, justifyContent: "center", alignItems: "center", }}>
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "white", }}>
            {props.Data.name}
          </Text>
          <View style={{ flexDirection: "row" }}>
            {props.buttonText1 ?
              <_ModalButton
                Data={props.Data}
                Text={props.buttonText1}
                onPress={props.onPress.buttonText1}
              />
              : null
            }
            {props.buttonText2 ?
              <_ModalButton
                Data={props.Data}
                Text={props.buttonText2}
                onPress={props.onPress.buttonText2}
              />
              : null
            }
            {props.buttonText3 ?
              <_ModalButton
                Data={props.Data}
                Text={props.buttonText3}
                onPress={props.onPress.buttonText3}
              />
              : null
            }
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback >
  );
}

export function _ModalButton(props) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "lightskyblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
      }}
      onPress={() => {
        props.onPress();
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "black",
        }}>
        {props.Text}
      </Text>
    </TouchableOpacity>
  );
}



/* Render Modal
_renderModal(projectData) {
  return (
    <TouchableWithoutFeedback onPress={() => this.closeModal(projectData)}>
      <Modal
        onBackdropPress={() => this.closeModal(projectData)}
        onBackButtonPress={() => this.closeModal(projectData)}
        onSwipe={() => this.closeModal(projectData)}
        swipeDirection="down"
        isVisible={projectData.modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{projectData.name}</Text>
          <View style={styles.modalFlex}>
            {this._renderModalButton(projectData, "Project Info")}
            {this._renderModalButton(projectData, "Requirements")}
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
}

// Render Modal Button
  _renderModalButton(projectData, buttonText) {
    return (
      
    );
  }
}

// Handles the onClick event for the modal buttons.
  onModalButtonClick(projectData, buttonText) {
    this.closeModal(projectData);
    if (buttonText === "Project Info") {
      return this.props.navigation.navigate("ProjectInfo", { uid: projectData.uid });
    } else {
      return this.props.navigation.navigate("Requirements", { uid: projectData.uid });
    }
  }

  // Closes the modal.
  closeModal(projectData) {
    projectData.modalVisible = false;
    if (this._isMounted) {
      this.setState(JSON.parse(JSON.stringify(this.state)));
    }
  }


*/
