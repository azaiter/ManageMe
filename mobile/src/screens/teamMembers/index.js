import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  Icon,
  View,
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
  ManageMe_LoadingScreen,
  ManageMe_DisplayError
} from "../../util/Render";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");
const HandleError = require("../../util/HandleError");

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
    this.assignTeamMembersToState();
    this.assignUsersToState();
    this.getRenderFromState.bind(this);
    this.onSelectedItemsChange.bind(this);
    this._renderBody.bind(this);
    this._renderTeamMemberData.bind(this);
  }

  // Refresh the page when coming from a back navigation event.
  willFocus = this.props.navigation.addListener("willFocus", () => {
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
    if ((this.state && this._isMounted) && (!this.state.teamMembersList || opts.refresh)) {
      this.setState({
        teamMembersList: undefined,
        getTeamMembers: undefined
      });
      let teamMember = [];
      ApiCalls.getTeamMembers({
        teamId: this.params.uid
      }).then(apiResults => {
        apiResults.forEach(result => {
          result.modalVisible = false;
          result.key = result.uid.toString() + "_" + result.modalVisible.toString();
          teamMember.push(result.uid);
        });
        this.setState({
          teamMembersList: apiResults,
          teamMember: teamMember,
        });
      }, error => {
        this.setState({
          teamMember: teamMember,
        });
        HandleError.handleError(this, error);
        Alert.alert("Error!",
          JSON.stringify(this.state.getTeamMembers || this.state.Error),
          (this.state.Error ?
            [{
              text: "OK", onPress: () => {
                this.assignTeamMembersToState({ refresh: true });
              }
            }] : null
          ), { cancelable: false }
        );
      });
    }
  }

  assignUsersToState(opts = { refresh: false }) {
    if ((this.state && this._isMounted) && (!this.state.userList || opts.refresh)) {
      this.setState({
        userList: undefined,
        getUserInfo: undefined
      });
      ApiCalls.getUserInfo().then(apiResults => {
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
      }, error => {
        HandleError.handleError(this, error);
        Alert.alert("Error!",
          JSON.stringify(this.state.getUserInfo || this.state.Error),
          (this.state.Error ?
            [{
              text: "OK", onPress: () => {
                this.assignUsersToState({ refresh: true });
              }
            }] : null
          ), { cancelable: false }
        );
      });
    }
  }

  // Retrieve Render from state.
  getRenderFromState() {
    if (
      this.state &&
      (this.state.userList || this.state.getUserInfo) &&
      (this.state.teamMembersList || this.state.getTeamMembers)
    ) {
      return true;
    } else {
      return false;
    }
  }

  onSelectedItemsChange = (selectedItems) => {
    let removed = this.state.teamMember.filter(x => !selectedItems.includes(x));
    let added = selectedItems.filter(x => !this.state.teamMember.includes(x));
    if (this._isMounted) {
      for (let i = 0; i < removed.length; i++) {
        const userID = removed[i];
        let userObj = this.state.teamMembersList.filter(x => x.uid === userID);
        if (!userObj[0].isLead) {
          ApiCalls.removeUserFromTeam({
            teamId: this.params.uid,
            userId: userID
          }).then(apiResults => {
          }, error => {
            HandleError.handleError(this, error);
            Alert.alert("User not Removed!",
              JSON.stringify(this.state.removeUserFromTeam || this.state.Error),
              (this.state.Error ?
                [{
                  text: "OK", onPress: () => {
                    this.props.navigate.navigation("TeamMembers");
                  }
                }] : null
              ), { cancelable: false }
            );
          });
        } else {
          Alert.alert("Cannot remove team lead.");
        }
      }
      for (let i = 0; i < added.length; i++) {
        const userID = added[i];
        ApiCalls.addUserToTeam({
          teamId: this.params.uid,
          userId: userID
        }).then(apiResults => {
        }, error => {
          HandleError.handleError(this, error);
          Alert.alert("User not Added!",
            JSON.stringify(this.state.addUserToTeam || this.state.Error),
            (this.state.Error ?
              [{
                text: "OK", onPress: () => {
                  this.props.navigate.navigation("TeamMembers");
                }
              }] : null
            ), { cancelable: false }
          );
        });
      }
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
      return (
        <Content padder>
          <View>
            {this.state.getUserInfo ?
              <ManageMe_DisplayError
                ApiErrors={this.state.getUserInfo}
              /> :
              <SectionedMultiSelect
                items={this.state.userList}
                uniqueKey="id"
                subKey="children"
                selectText="Add / Remove Members"
                searchPlaceholderText="Search..."
                showChips={false}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.teamMember}
                onConfirm={() => this.assignTeamMembersToState({ refresh: true })}
                readOnlyHeadings={true}
                style={{
                  selectToggle: {
                    width: "100%",
                  },
                }}
              />}
          </View>
          {this.state.getTeamMembers ?
            <ManageMe_DisplayError
              ApiErrors={this.state.getTeamMembers}
            /> :
            <FlatList
              style={styles.container}
              data={this.state.teamMembersList.sort((a, b) => b.isLead - a.isLead)}
              renderItem={data => this._renderTeamMemberData(data.item)}
            />
          }
        </Content>
      );
    } else {
      return <ManageMe_LoadingScreen />;
    }
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
    ApiCalls.makeTeamLead({
      teamId: this.params.uid,
      userId: teamMemberData.uid
    }).then(apiResults => {
      Alert.alert("Success", `"${teamMemberData.first_name} ${teamMemberData.last_name}" has been made Team Lead !`,
        [
          {
            text: "OK", onPress: () => {
              this.assignTeamMembersToState({ refresh: true });
            }
          },
        ],
        { cancelable: false });
    }, error => {
      HandleError.handleError(this, error);
      Alert.alert("Error!",
        JSON.stringify(this.state.makeTeamLead || this.state.Error),
        (this.state.Error ?
          [{
            text: "OK", onPress: () => {
              this.assignTeamMembersToState({ refresh: true });
            }
          }] : null
        ), { cancelable: false }
      );
    });
  }
}

export default TeamMembers;
