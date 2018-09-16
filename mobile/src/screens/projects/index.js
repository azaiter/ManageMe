import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Text,
  Icon,
  List,
  ListItem,
  Card,
  CardItem
} from "native-base";
import styles from "./styles";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");
class Projects extends Component {
  constructor(props){
    super(props);
    this.state = {};
    Auth.setIsLoginStateOnScreenEntry(this, {navigate:"Projects"});
  }

  assignProjectsToState(opts={refresh:false}){
    if (!this.state.projectsList || opts.refresh){
      ApiCalls.getProjects().then(response=>{
        ApiCalls.handleAPICallResult(response).then(apiResults=>{
          if (apiResults){
            this.setState({
              projectsList:apiResults
            });
          }
        });
      });
    }
  }

  getProjectsFromState(){
    if (this.state && this.state.projectsList){
      return this.state.projectsList;
    }
    else {
      return [];
    }
  }

  render() {
    this.assignProjectsToState();
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Projects</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.assignProjectsToState({refresh:true})}
            >
              <Icon name="refresh" />
            </Button>
          </Right>
        </Header>

        <Content padder>
          <List
              dataArray={this.getProjectsFromState()}
              renderRow={data =>
                <ListItem>
                  <Card style={styles.mb}>
                    <CardItem bordered>
                      <Left>
                        <Body>
                          <Text>{data.uid} - {data.name}</Text>
                          <Text note>{data.created}</Text>
                        </Body>
                      </Left>
                    </CardItem>

                    <CardItem>
                      <Body>
                        <Text>
                          Description: {data.desc}
                        </Text>
                      </Body>
                    </CardItem>
                  </Card>
                </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

export default Projects;
