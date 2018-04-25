import React, { Component } from 'react';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project';
import {getLocalToken, removeLocalToken, saveItem} from './utils/Auth';
import {getProjects} from './utils/HttpHelper';


export default class Routes extends Component{
	constructor(props){
		super(props);
		this.state = {
			authenticated: false,
			loaded: false
		}
	}

	componentWillMount() {
		getLocalToken().then(t => {
			getProjects(t).then(res => {
				if(res[1] !== 200 || res[0].token){
					removeLocalToken();
					return
				}
				Actions.reset('dashboard');
				return;
			});
		})
	}

	render() {
			return(
				<Router>
					<Stack key="root" hideNavBar={false}>
						<Scene key="dashboard" component={Dashboard} title="Projects" />
						<Scene key="login" component={Login} title="Login" initial={true}/>
						<Scene key="project" component={Project} title="Requirements"/>
					</Stack>
				 </Router>
				)
		}
		
	
}