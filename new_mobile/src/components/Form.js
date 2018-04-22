import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity 
} from 'react-native';

export default class Form extends Component {

  constructor(props){
    super(props);
    this.state = {
      username: "",
      password: ""
    }
    
  }

	render(){
		return(
			<View style={styles.container}>
          <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Username"
              placeholderTextColor = "#000"
              selectionColor="#000"
              onChangeText={(value) => this.setState({username: value})}
              value={this.state.username}
              />
          <TextInput style={styles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor = "#000"
              onChangeText={(value) => this.setState({password: value})}
              value={this.state.password}
              />  
           <TouchableOpacity style={styles.button} disabled={!this.state.username||!this.state.password}>
             <Text onPress={() => this.props.buttonClick(this.state.username, this.state.password)} style={styles.buttonText}>{this.props.type}</Text>
           </TouchableOpacity>     
  		</View>
			)
	}
}

const styles = StyleSheet.create({
  container : {
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#ffffffb3',
    borderRadius: 10,
    paddingHorizontal: 10
  },

  inputBox: {
    width: 275,
    outline: 0,
    borderBottomWidth: 1,
    borderBottomHeight: 1,
    borderColor: '#000',
    paddingHorizontal:16,
    fontSize:16,
    color:'#000',
    marginVertical: 10,
    zIndex: 999,
  },
  button: {
    width: 300,
    backgroundColor:'#00ff7f',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#000',
    textAlign:'center'
  }
  
});