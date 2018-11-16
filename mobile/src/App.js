import React from "react";
import { Root } from "native-base";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";

import SideBar from "./screens/sidebar";

import Home from "./screens/home/";
import Projects from "./screens/projects";
import Teams from "./screens/teams";
import Permissions from "./screens/permissions";
import Users from "./screens/users";

import CreateProject from "./screens/createProject";
import ProjectInfo from "./screens/projectInfo";
import Requirements from "./screens/requirements";
import CreateRequirement from "./screens/createRequirement";

import CreateTeam from "./screens/createTeam";
import TeamMembers from "./screens/teamMembers";

import CreateUser from "./screens/createUser";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    Projects: { screen: Projects },
    Teams: { screen: Teams },
    Permissions: { screen: Permissions },
    Users: { screen: Users },
  },
  {
    initialRouteName: "Projects",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },

    CreateProject: { screen: CreateProject },
    ProjectInfo: { screen: ProjectInfo },
    Requirements: { screen: Requirements },
    CreateRequirement: { screen: CreateRequirement },

    CreateTeam: { screen: CreateTeam },
    TeamMembers: { screen: TeamMembers },

    CreateUser: { screen: CreateUser },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <AppNavigator />
  </Root>;
