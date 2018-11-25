import React, { Component } from "react";
import {
    Container,
    Content,
    Text,
    Icon,
    View,
    Spinner,
} from "native-base";
import styles from "./styles";
import { TouchableOpacity, FlatList, TouchableWithoutFeedback, Alert } from "react-native";
import Modal from "react-native-modal";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { ManageMe_Header } from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");

class TeamMembers extends Component {
    _isMounted = false;
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
        this.assignUsersToState.bind(this);
        this.getRenderFromState.bind(this);
        this.onSelectedItemsChange.bind(this);
        this.onModalButtonClick.bind(this);
        this.closeModal.bind(this);
        this._renderBody.bind(this);
        this._renderLoadingScreen.bind(this);
        this._renderTeamMemberData.bind(this);
        this._renderModal.bind(this);
        this._renderModalButton.bind(this);
    }

    // Refresh the page when coming from a back navigation event.
    willFocus = this.props.navigation.addListener("willFocus", payload => {
        this.assignTeamMembersToState({ refresh: true });
        this.assignUsersToState({ refresh: true });

    });

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Retrieve team members list from API and assign to state.
    assignTeamMembersToState(opts = { refresh: false }) {
        if ((this.state && this.state.loggedIn) && (!this.state.teamMembersList || opts.refresh)) {
            ApiCalls.getTeamMembers(this.params.uid).then(response => {
                if (this._isMounted) {
                    ApiCalls.handleAPICallResult(response, this).then(apiResults => {
                        let teamMember = [];
                        if (apiResults) {
                            apiResults.forEach(result => {
                                result.modalVisible = false;
                                result.key = result.uid.toString() + "_" + result.modalVisible.toString();
                                teamMember.push(result.uid);
                            });
                            this.setState({
                                teamMembersList: apiResults,
                                teamMember: teamMember,
                            });
                        } else {
                            this.setState({
                                teamMember: teamMember,
                                teamMembersList: "null",
                            });
                        }
                    });
                }
            });
        }
    }

    assignUsersToState(opts = { refresh: false }) {
        if ((this.state && this.state.loggedIn) && (!this.state.userList || opts.refresh)) {
            ApiCalls.getUserInfo().then(response => {
                if (this._isMounted) {
                    ApiCalls.handleAPICallResult(response, this).then(apiResults => {
                        if (apiResults) {
                            let userList = [
                                {
                                    name: "Users",
                                    id: 0,
                                    children: apiResults.map(x => { return { name: x.first_name + " " + x.last_name, id: x.uid }; })
                                }
                            ];
                            this.setState({
                                userList: userList,
                            });
                        }
                    });
                }
            });
        }
    }

    // Retrieve Render from state.
    getRenderFromState() {
        if (this.state && this.state.userList && this.state.teamMembersList && this.state.teamMember) {
            return true;
        } else {
            return false;
        }
    }

    onSelectedItemsChange = (selectedItems) => {
        let removed = this.state.teamMember.filter(x => !selectedItems.includes(x));
        let added = selectedItems.filter(x => !this.state.teamMember.includes(x));
        for (let i = 0; i < removed.length; i++) {
            const userID = removed[i];
            let userObj = this.state.teamMembersList.filter(x => x.uid === userID);
            if (!userObj[0].isLead) {
                ApiCalls.removeUserFromTeam(this.params.uid, userID).then(response => {
                    if (this._isMounted) {
                        ApiCalls.handleAPICallResult(response, this).then(apiResults => {
                            if (apiResults) { }
                            else {
                                Alert.alert("User not Removed!", JSON.stringify(this.state.ApiErrorsList));
                            }
                        });
                    }
                });
            } else {
                Alert.alert("Cannot remove team lead.");
            }
        }
        for (let i = 0; i < added.length; i++) {
            const userID = added[i];
            ApiCalls.addUserToTeam(this.params.uid, userID).then(response => {
                if (this._isMounted) {
                    ApiCalls.handleAPICallResult(response, this).then(apiResults => {
                        if (apiResults) { }
                        else {
                            Alert.alert("User not Added!", JSON.stringify(this.state.ApiErrorsList));
                        }
                    });
                }
            });
        }
        if (this._isMounted) {
            this.setState({
                teamMember: selectedItems
            });
        }
    }

    // Handles the onClick event for the modal buttons.
    onModalButtonClick(teamMemberData, buttonText) {
        this.closeModal(teamMemberData);
        if (buttonText === "Assign Lead") {
            ApiCalls.makeTeamLead(this.params.uid, teamMemberData.uid).then(response => {
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
        if (this._isMounted) {
            this.setState(JSON.parse(JSON.stringify(this.state)));
        }
    }

    render() {
        this.assignTeamMembersToState();
        this.assignUsersToState();
        return (
            <Container style={styles.container}>
                <ManageMe_Header
                    title="Team Members"
                    leftIcon="back"
                    onPress={{
                        left: this.props.navigation.goBack,
                        refresh: () => { this.assignTeamMembersToState({ refresh: true }); }
                    }}
                />
                {this._renderBody()}
            </Container>
        );
    }

    _renderBody() {
        if (this.getRenderFromState()) {
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
                    {this.state.teamMembersList === "null" ?
                        <View style={styles.warningView} >
                            <Icon style={styles.warningIcon} name="warning" />
                            <Text style={styles.warningText}>{this.state.ApiErrorsList}</Text>
                        </View> :
                        <FlatList
                            style={styles.container}
                            data={this.state.teamMembersList.sort((a, b) => b.isLead - a.isLead)}
                            renderItem={data => this._renderTeamMemberData(data.item)}
                        />
                    }
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
                if (this._isMounted) {
                    this.setState(JSON.parse(JSON.stringify(this.state)));
                }
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
                {teamMemberData.isLead === 1 ? null : this._renderModal(teamMemberData)}
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
