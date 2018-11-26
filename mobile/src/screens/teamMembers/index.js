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
import {
    TouchableOpacity,
    FlatList,
    Alert
} from "react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import {
    ManageMe_Header,
    ManageMe_Modal,
} from "../../util/Render";
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
        this._renderBody.bind(this);
        this._renderLoadingScreen.bind(this);
        this._renderTeamMemberData.bind(this);
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

    // Modal Set State.
    modalSetstate = async (teamMemberData) => {
        if (this._isMounted) {
            teamMemberData.modalVisible = !teamMemberData.modalVisible;
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
                        left: () => this.props.navigation.goBack(),
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
            <TouchableOpacity style={styles.teamItem} onPress={() =>
                this.modalSetstate(teamMemberData)
            }>
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
                    <ManageMe_Modal
                        data={teamMemberData}
                        button={
                            [
                                {
                                    text: "Assign Lead",
                                    onPress: () => { this.makeTeamLead(teamMemberData); }
                                }
                            ]
                        }
                        onPress={{ modal: () => this.modalSetstate(teamMemberData) }}
                    />
                }
            </TouchableOpacity>
        );
    }

    makeTeamLead(teamMemberData) {
        ApiCalls.makeTeamLead(this.params.uid, teamMemberData.uid).then(response => {
          ApiCalls.handleAPICallResult(response, this).then(apiResults => {
            if (apiResults) {
              Alert.alert("Success", `"${teamMemberData.first_name} ${teamMemberData.last_name}" has been made Team Lead !`,
                [
                  {
                    text: "OK", onPress: () => {
                        this.assignTeamMembersToState({ refresh: true });
                    }
                  },
                ],
                { cancelable: false });
            }
          });
        });
      }
}

export default TeamMembers;
