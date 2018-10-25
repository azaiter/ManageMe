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
import SectionedMultiSelect from "react-native-sectioned-multi-select";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class TeamMembers extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        Auth.setIsLoginStateOnScreenEntry(this, {
            navigate: "TeamMembers",
            setUserPermissions: true
        });
        Auth.userHasPermission.bind(this);
        this.assignTeamMembersToState.bind(this);
        this.state = { teamID: this.params.uid};
    }

    // Retrieve team members list from API and assign to state.
    assignTeamMembersToState(opts = { refresh: false }) {
        if ((this.state && this.state.loggedIn) && (!this.state.teamMembersList || opts.refresh)) {
            ApiCalls.getTeamMembers(this.params.uid).then(response => {
                let teamMember = [];
                if (response[1] === 200) {
                    ApiCalls.handleAPICallResult(response).then(apiResults => {
                        if (apiResults) {
                            apiResults.forEach(result => {
                                result.modalVisible = false;
                                result.key = result.uid.toString() + "_" + result.modalVisible.toString();
                                teamMember.push(result.uid);
                              });
                            this.setState({
                                id: 1,
                                teamMembersList: apiResults,
                                teamMember: teamMember,
                                render: true
                            });
                        }
                    });
                }
                else {
                    this.setState({
                        id: -1,
                        teamMember: teamMember,
                        render: true
                    });
                }
            });
        }
    }

    assignUsersToState(opts = { refresh: false }) {
        if ((this.state && this.state.loggedIn) && (!this.state.userList || opts.refresh)) {
            ApiCalls.getUserInfo().then(_response => {
                ApiCalls.handleAPICallResult(_response, this).then(_apiResults => {
                    if (_apiResults) {
                        let userList = [
                            {
                                name: "Users",
                                id: 0,
                                children: _apiResults.map(x => { return { name: x.first_name + " " + x.last_name, id: x.uid }; })
                            }
                        ];
                        this.setState({
                            userList: userList,
                        });
                    }
                });
            });
        }
    }

    onSelectedItemsChange = (selectedItems) => {
        let removed = this.state.teamMember.filter(x => !selectedItems.includes(x));
        let added = selectedItems.filter(x => !this.state.teamMember.includes(x));
        for (let i = 0; i < removed.length; i++) {
            const userID = removed[i];
            ApiCalls.removeUserFromTeam(this.state.teamID, userID).then(res => {
                ApiCalls.handleAPICallResult(res, this).then(apiResults => {
                });
            });
        }
        for (let i = 0; i < added.length; i++) {
            const userID = added[i];
            ApiCalls.addUserToTeam(this.state.teamID, userID).then(res => {
                ApiCalls.handleAPICallResult(res, this).then(apiResults => {
                });
            });
        }
        this.setState({
            teamMember: selectedItems
        });
    }

    // Handles the onClick event for the modal buttons.
    onModalButtonClick(teamMemberData, buttonText) {
        this.closeModal(teamMemberData);
        if (buttonText === "Assign Lead") {
            ApiCalls.makeTeamLead(this.state.teamID, teamMemberData.uid).then(response => {
                ApiCalls.handleAPICallResult(response, this).then(apiResults => {
                    if (apiResults) {
                        this.assignTeamMembersToState({ refresh: true });
                    }
                });
            });
        }
    }

    // Closes the modal.
    closeModal(teamMemberData) {
        teamMemberData.modalVisible = false;
        this.setState(JSON.parse(JSON.stringify(this.state)));
    }

    render() {
        this.assignTeamMembersToState();
        this.assignUsersToState();
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
            let selectedDataHandler = (y) => {
                this.onSelectedItemsChange(y);
                this.assignTeamMembersToState({ refresh: true });
            };
            return (
                <Content padder>
                    <View>
                        <SectionedMultiSelect
                            items={this.state.userList}
                            uniqueKey="id"
                            subKey="children"
                            selectText="Add / Remove Members"
                            searchPlaceholderText="Search..."
                            showChips={false}
                            onSelectedItemsChange={selectedDataHandler}
                            selectedItems={this.state.teamMember}
                            readOnlyHeadings={true}
                            style={{
                                selectToggle: {
                                    width: "100%",
                                },
                            }}
                        />
                    </View>
                    {this.state.id === -1 ?
                        <Text style={styles.title}>No Team Members Assigned</Text> :
                        <FlatList
                            style={styles.container}
                            data={this.state.teamMembersList.sort((a, b) => b.isLead - a.isLead)}
                            renderItem={data => this._renderTeamMemberData(data.item)}
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
                    <Text style={[styles.title, styles["isLead" + teamMemberData.isLead]]}>{teamMemberData.first_name} {teamMemberData.last_name}</Text>
                    <Text style={styles.body}>
                        email - {teamMemberData.email}
                    </Text>
                    <Text style={styles.body}>
                        username - {teamMemberData.username}
                    </Text>
                    <View style={styles.bodyFlex}>
                        {teamMemberData.isLead === 1 ?
                            <Text style={styles.body}>Team Lead: Yes</Text> :
                            <Text style={styles.body}>Team Lead: No</Text>
                        }
                    </View>
                </View>
                <Icon style={styles.icon} name="more" />
                {teamMemberData.isLead === 1 ? null :
                    this._renderModal(teamMemberData)}
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
