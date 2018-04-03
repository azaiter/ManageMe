import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, RefreshControl  } from "react-native";
import { List, ListItem, SearchBar, Card } from "react-native-elements";
import {getRequirementsByProjectId, clockIn, clockOut} from '../utils/HttpHelper';
import {getLocalToken} from '../utils/Auth';
import MaterialInitials from 'react-native-material-initials/native';
import Avatar from 'react-native-user-avatar';
import Spinner from 'react-native-spinkit';
import DropdownAlert from 'react-native-dropdownalert';

export default class Project extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    };
  }

  componentDidMount() {
    this.getRequirements();
  }

  async getRequirements(){
    const { page, seed } = this.state;
    let token = await getLocalToken();
    getRequirementsByProjectId(token,this.props.projID).then(res => {
        this.setState({
          data: res[0],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      });
  }

  async clockInOut(id){
    let token = await getLocalToken();
      clockIn(token, id).then(values =>{
        if(values[1] === 200){
          this.dropdown.alertWithType('success', 'Clocked In!', 'You are now clocked in!');
        }else{
          clockOut(token, id).then(res => {    
            if(res[1] === 200){
              this.dropdown.alertWithType('info', 'Clocked Out!', 'You are now clocked out!');
            }else{
              this.dropdown.alertWithType('error', 'Error', res[0].message);
            }
        });
      }

      });
  }

  async _onRefresh() {
    let token = await getLocalToken();
    this.setState({refreshing: true});
    getRequirementsByProjectId(token,this.props.projID).then((res) => {
      this.setState({
        data: res[0],
        error: res.error || null,
        loading: false,
        refreshing: false
      });
    });
  }
  
  render() {
    if(this.state.loading){
      return <View style={styles.container}><Spinner style={styles.spinner} color={'#fff'} type={'9CubeGrid'}/></View>
    }else if(this.state.data.length === 0){
      return (<View style={{backgroundColor: '#455a64', flex: 1, resizeMode: 'cover'}}>
      <ScrollView style={{top: '-4%'}} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', justifyContent: 'space-between', top: "5%", padding: 10}}><Text style={{fontSize: 32, color: '#fff', top: 5}}>There are zero requirements!</Text> /></View>
      </ScrollView>
    </View>)
    }else{
      return (
        <View style={{backgroundColor: '#455a64', flex: 1, resizeMode: 'cover'}}>
        <ScrollView style={{top: '-4%'}} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          
          <List >
          {
            this.state.data.map((i) => (
              
              <ListItem
                roundAvatar
                style = {{backgroundColor: (i.clocked_in === 'Y') ? 'green' : null}}
                key={i.name}
                title={i.name}
                subtitle={"Description: "+i.desc}
                onPress={() => {this.clockInOut(i.uid)}}
                avatar={<Avatar size="50" name={i.name.toLowerCase()}/>}
              />
            ))
          }
        </List>
        </ScrollView>
        <DropdownAlert closeInterval={1500} ref={ref => this.dropdown = ref} />
      </View>
      
      );
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
  
});