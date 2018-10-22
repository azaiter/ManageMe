import React, { Component } from "react";
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Left,
    Right,
    Body,
    Text,
    Icon,
    View,
    Spinner,
} from "native-base";
import styles from "./styles";
import { TouchableOpacity, FlatList, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class TeamMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.params = this.props.navigation.state.params;
        Auth.setIsLoginStateOnScreenEntry(this, {
            navigate: "TeamMembers",
            setUserPermissions: true
        });
        Auth.userHasPermission.bind(this);
        this.assignTeamMembersToState.bind(this);
    }

    // Retrieve team members list from API and assign to state.
    assignTeamMembersToState(opts = { refresh: false }) {
        if ((this.state && this.state.loggedIn) && (!this.state.teamMembersList || opts.refresh)) {
            ApiCalls.getTeamMembers(this.params.uid).then(response => {
                if (response[1] === 200) {
                    ApiCalls.handleAPICallResult(response).then(apiResults => {
                        if (apiResults) {
                            this.setState({
                                teamID: this.params.uid,
                                teamMembersList: apiResults,
                                render: true
                            });
                        }
                    });
                }
                else {
                    this.setState({
                        teamID: -1,
                        render: true
                    });
                }
            });
        }
    }

    // Handles the onClick event for the modal buttons.
    onModalButtonClick(teamMemberData, buttonText) {
      this.closeModal(teamMemberData);
      if (buttonText === "Remove") {
        // remove team member
      } else {
        ApiCalls.makeTeamLead(this.state.teamID, teamMemberData.uid).then(response => {
          return true;
        });
        // removeTeamMember
      }
    }

    // Closes the modal.
    closeModal(teamMemberData) {
        teamMemberData.modalVisible = false;
        this.setState(JSON.parse(JSON.stringify(this.state)));
    }

    render() {
        this.assignTeamMembersToState();
        return (
            <Container style={styles.container}>
                {this._renderHeader()}
                {this._renderBody()}
            </Container>
        );
    }

    _renderHeader() {
        return (
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
                    <Title>Team Members</Title>
                </Body>
                <Right style={styles.flex}>
                    <Button
                        transparent
                        onPress={() => this.props.navigation.navigate("AddMember")}
                    >
                        <Icon name="add" />
                    </Button>
                    <Button
                        transparent
                        onPress={() => this.assignTeamMembersToState({ refresh: true })}
                    >
                        <Icon name="refresh" />
                    </Button>
                </Right>
            </Header>
        );
    }

    _renderBody() {
        if (this.state.render) {
            return (
                <Content padder>
                    {this.state.teamID === -1 ?
                        <Text style={styles.title}>No Team Members Assigned</Text> :
                        <FlatList
                            style={styles.container}
                            data={this.state.teamMembersList}
                            renderItem={data => this._renderTeamMemberData(data.item)}
                            keyExtractor={item => item.uid.toString()}
                        />}
                </Content>
            );
        } else {
            return this._renderLoadingScreen();
        }
    }

    _renderLoadingScreen() {
        return (
            <Content padder>
                <Spinner color="blue" />
            </Content>
        );
    }

    _renderTeamMemberData(teamMemberData) {
        return (
            <TouchableOpacity style={styles.teamItem} onPress={() => {
                teamMemberData.modalVisible = true;
                this.setState(JSON.parse(JSON.stringify(this.state)));
            }}>
                <View style={styles.text}>
                    <Text style={styles.title}>{teamMemberData.first_name} {teamMemberData.last_name}</Text>
                    <Text style={styles.body}>
                        email - {teamMemberData.email}
                    </Text>
                    <Text style={styles.body}>
                        username - {teamMemberData.username}
                    </Text>
                    {teamMemberData.isLead === 1 ?
                        <Text style={styles.body}>Team Lead: Yes</Text> :
                        <Text style={styles.body}>Team Lead: No</Text>
                    }
                </View>
                <Icon style={styles.icon} name="more" />
                {this._renderModal(teamMemberData)}
            </TouchableOpacity>
        );
    }

    _renderModal(teamMemberData) {
        return (
            <TouchableWithoutFeedback onPress={() => this.closeModal(teamMemberData)}>
                <Modal
                    onBackdropPress={() => this.closeModal(teamMemberData)}
                    onBackButtonPress={() => this.closeModal(teamMemberData)}
                    onSwipe={() => this.closeModal(teamMemberData)}
                    swipeDirection="down"
                    isVisible={teamMemberData.modalVisible}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{teamMemberData.first_name} {teamMemberData.last_name}</Text>
                        <View style={styles.modalFlex}>
                            {this._renderModalButton(teamMemberData, "Assign Lead")}
                            {this._renderModalButton(teamMemberData, "Remove")}
                        </View>
                    </View>
                </Modal>
            </TouchableWithoutFeedback>
        );
    }

    _renderModalButton(teamMemberData, buttonText) {
        return (
            <TouchableOpacity style={styles.modalButton} onPress={() => {
                this.onModalButtonClick(teamMemberData, buttonText);
            }}>
                <Text style={styles.modalText}>{buttonText}</Text>
            </TouchableOpacity>
        );
    }
}

export default TeamMembers;
