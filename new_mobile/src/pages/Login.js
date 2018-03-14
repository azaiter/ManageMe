import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import Background from '../videos/stock.mp4';
import {getToken} from '../utils/HttpHelper';

import Form from '../components/Form';

import {Actions} from 'react-native-router-flux';
import {saveItem} from '../utils/Auth';
import DropdownAlert from 'react-native-dropdownalert';


export default class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      
    }
    
  }

	signup() {
		Actions.signup()
  }
  
  signIn(username, password){
    getToken(username, password).then(res =>{
      const json = res[0];
      const status = res[1];
      if(status !== 200){
        this.dropdown.alertWithType('error', 'Wrong Username or Password', 'You entered invalid credentials!');
      }
      if(json.token){
        saveItem('@app:session', json.token);
        Actions.dashboard();
      }
      
    })
  }

	render() {
		return(
			<View style={styles.container}>
                <Video repeat source={Background} resizeMode="cover" style={StyleSheet.absoluteFill} />
				<Form type="Login" buttonClick={this.signIn}/>
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Don't have an account yet?</Text>
					<TouchableOpacity onPress={this.signup}><Text style={styles.signupButton}> Signup</Text></TouchableOpacity>
				</View>
        <DropdownAlert closeInterval={1500} ref={ref => this.dropdown = ref} />
			</View>	
			)
	}
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:'#455a64',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  },
  signupTextCont : {
  	flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:30,
    flexDirection:'row'
  },
  signupText: {
  	color:'rgba(255,255,255,0.6)',
  	fontSize:16
  },
  signupButton: {
  	color:'#ffffff',
  	fontSize:16,
  	fontWeight:'500'
  }
});