import React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from "react-router";

import { Route, DefaultRoute, RouteHandler } from "react-router";

class ToolBar extends React.Component {
  
  render() {
  	
  	return (
          <div>
            <Link to="/dashboard/reports" className="pull-right btn btn-primary btn-outline btn-rounded">View Reports</Link> 
            <Link to="/createProject" className="pull-right btn btn-primary btn-outline btn-rounded">Create Project</Link> 
            <Link to="/createTeam" className="pull-right btn btn-primary btn-outline btn-rounded">Create Team</Link> 
          </div>
        
    );
  }
}

export default ToolBar;