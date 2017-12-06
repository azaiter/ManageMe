import React from "react";
import { Router, Route, DefaultRoute, RouteHandler, Redirect } from "react-router";

import BaseLayout from "../components/layouts/Base";
import DashboardLayout from "../components/layouts/Dashboard";

import DashboardOverviewPage from "../components/pages/dashboard/Overview";
import DashboardReportsPage from "../components/pages/dashboard/Reports";
import LoginPage from "../components/pages/Login";
import RegisterPage from "../components/pages/Register";
import CreateProject from "../components/pages/dashboard/Forms/CreateProject";
import DashboardProjectPage from "../components/pages/dashboard/Projects"
import AdminPage from "../components/pages/dashboard/Administrator"
import CreateTeam from "../components/pages/dashboard/Forms/CreateTeam"

class Routes extends React.Component {
  static getRoutes() {
    return (
        <Route name="base" path="/" handler={BaseLayout}>
          <Route name="dashboard" path="/dashboard" handler={DashboardLayout}>
            <Route name="dashboard.overview" path="/overview" handler={DashboardOverviewPage} />
            <Route name="dashboard.project" path="/project" handler={DashboardProjectPage} />
            <Route name="dashboard.reports" path="/reports" handler={DashboardReportsPage} />
            <Route name="dashboard.admin" path="/admin" handler={AdminPage} />
            <DefaultRoute name="dashboard.default" handler={DashboardOverviewPage} />
          </Route>
          <Route name="login" path="/login" handler={LoginPage} />
          <Route name="register" path="/register" handler={RegisterPage} />
          <Route name="createProject" path="/createProject" handler={CreateProject} />
          <DefaultRoute name="default" handler={DashboardLayout} />
          <Route name="createTeam" handler={CreateTeam} />

          <Redirect from="/" to="dashboard.overview" />
        </Route>
    );
  }

  render() {
  
  }
}

export default Routes;