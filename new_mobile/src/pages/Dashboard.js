import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView, StyleSheet, Image, TouchableOpacity, RefreshControl, AppState } from "react-native";
import { List, ListItem, SearchBar, Overlay, h1 } from "react-native-elements";
import {getProjects, getMyInfo} from '../utils/HttpHelper';
import {getLocalToken, removeLocalToken} from '../utils/Auth';
import {Actions} from 'react-native-router-flux';
import Avatar from 'react-native-user-avatar';
import Spinner from 'react-native-spinkit';


export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getProjects();
  }

  async getProjects(){
    const { page, seed } = this.state;
    const t = await getLocalToken();
    const res = await getProjects(t);
    if(res[1] !== 200 || res[0].token){
      await removeLocalToken();
      Actions.reset('login');
      return;
    }
    this.setState({
      data: res[0],
      error: res.error || null,
      loading: false,
      refreshing: false
    });

  }

  async _onRefresh() {
    let token = await getLocalToken();
    this.setState({refreshing: true});
    this.getProjects();
  }
  
  render() {
    
    if(this.state.loading){
      return <View style={styles.container}><Spinner style={styles.spinner} color={'#fff'} type={'9CubeGrid'}/></View>
    }else if(this.state.data.length === 0){
      
      return <View style={{backgroundColor: '#455a64', flex: 1}}>
      <ScrollView style={{top: '-4%'}} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
            tintColor={'#000'}
          />}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', justifyContent: 'space-between', top: "5%", padding: 10}}><Text style={{fontSize: 32, color: '#fff', top: 5}}>There are no projects aligned to you!</Text> </View> 
            </ScrollView>
              </View>
    }else{
      
      return (
      
        <View style={{backgroundColor: '#455a64', flex: 1, resizeMode: 'cover'}}>
        <ScrollView style={{marginTop: '-6%'}} contentContainerStyle={{flexGrow: 1}} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          
          <List>
          {
            this.state.data.reverse().map((i) => (
              
              <ListItem
                roundAvatar
                key={i.name}
                title={i.name}
                subtitle={"Description: "+i.desc}
                onPress={() => {Actions.project({projID: i.uid, projName: i.name, projDesc: i.desc, projCreated: i.created})}}
                avatar={<Avatar size="50" name={i.name.toLowerCase()}/>}
              />
            ))
          }
        </List>
        </ScrollView>
      </View>
      );
    }
    
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },

  spinner: {
    marginBottom: 50
  },

  btn: {
    marginTop: 20
  },

  text: {
    color: "white"
  },
  button: {
    width:300,
    backgroundColor:'#00ff7f',
    borderRadius: 15,
    marginVertical: 20,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#000',
    textAlign:'center'
  }
});