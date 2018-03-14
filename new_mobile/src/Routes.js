import React, { Component } from 'react';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project';
import {getLocalToken} from './utils/Auth';


export default class Routes extends Component{
	constructor(props){
		super(props);
		this.state = {
			authenticated: null,
			loaded: false
		}
	}

	componentWillMount() {
		getLocalToken().then(t => {this.setState({authenticated: t, loaded: true})})
	}
	render() {
		if(this.state.loaded){
			return(
				<Router>
					<Stack key="root" hideNavBar={false}>
						{this.state.authenticated ? <Scene key="dashboard" component={Dashboard} title="Projects" initial={true}/> : <Scene key="login" component={Login} title="Login" initial={true}/>}
						<Scene key="signup" component={Signup} title="Register"/>
						<Scene key="project" component={Project} title="Requirements"/>
					</Stack>
				 </Router>
				)
		}
		return null;
		
	}
}