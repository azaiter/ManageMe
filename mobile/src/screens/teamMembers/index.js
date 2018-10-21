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
    Spinner
} from "native-base";
import styles from "./styles";
import { FlatList } from "react-native";
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
                                teamID: 0,
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

    // Render
    render() {
        this.assignTeamMembersToState();
        return (
            <Container style={styles.container}>
                {this._renderHeader()}
                {this._renderBody()}
            </Container>
        );
    }

    // Render Header
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

    // Render Body
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

    // Render loading screen
    _renderLoadingScreen() {
        return (
            <Content padder>
                <Spinner color="blue" />
            </Content>
        );
    }

    // Render Project Data
    _renderTeamMemberData(teamMemberData) {
        return (
            <View style={styles.text}>
                <Text style={styles.title}>{teamMemberData.first_name} {teamMemberData.last_name}</Text>
                <Text style={styles.body}>
                    email - {teamMemberData.email}
                </Text>
                <Text style={styles.body}>
                    username - {teamMemberData.username}
                </Text>
            </View>
        );
    }
}
export default TeamMembers;
