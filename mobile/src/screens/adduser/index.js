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
    Input,
    Label,
    Item,
    Form,
    List
} from "native-base";
import {Alert, Platform} from "react-native";
import styles from "./styles";
const Auth = require("../../util/Auth");
const ApiCalls = require("../../util/ApiCalls");


const fieldsArr = [
    {
        name:"firstName",
        lable:"First Name",
        regex: /^.+$/,
        keyboardType: "default",
        secureTextEntry: false
    },
    {
        name:"lastName",
        lable:"Last Name",
        regex: /^.+$/,
        keyboardType: "default",
        secureTextEntry: false
    },
    {
        name:"email",
        lable:"Email Address",
        regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        keyboardType: "email-address",
        secureTextEntry: false
    },
    {
        name:"phoneNumber",
        lable:"Phone Number",
        regex: /^\d{10}$/,
        keyboardType: "number-pad",
        secureTextEntry: false
    },
    {
        name:"address",
        lable:"Address",
        regex: /^.+$/,
        keyboardType: "default",
        secureTextEntry: false
    },
    {
        name:"wage",
        lable:"Address",
        regex: /^\d+(.\d+)?$/,
        keyboardType: "decimal-pad",
        secureTextEntry: false
    },
    {
        name:"username",
        lable:"Username",
        regex: /^.+$/,
        keyboardType: "default",
        secureTextEntry: false
    },
    {
        name:"password",
        lable:"Password",
        regex: /^(?=(?:[^A-Z]*[A-Z]){1})(?=[^!@#$&*]*[!@#$&*])(?=(?:[^0-9]*[0-9]){1}).{8,}$/,
        keyboardType: "default",
        secureTextEntry: false
    }
];

class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            wage: "",
            username: "",
            password: ""
        };
        Auth.setIsLoginStateOnScreenEntry(this, { navigate: "AddUser", setUserPermissions: true });
        Auth.getPermissions.bind(this);
        this.checkAndSetState.bind(this);
        this.getFieldValidation.bind(this);
        this.renderFieldEntry.bind(this);
    }
    handleSubmit = async ()=> {
        this.setState({isLoading: true});
        if (fieldsArr.filter(x=>{ return !this.state[x.name + "Validation"];}).length > 0){
            ApiCalls.showToastsInArr(["Some of the fields below are invalid."], {
                buttonText: "OK",
                type: "danger",
                position: "top",
                duration: 5 * 1000
            });
        }
        else {
            let apiResult = await ApiCalls.createUser(this.state.firstName, this.state.lastName, this.state.email, this.state.phoneNumber, this.state.address, this.state.username, this.state.password, this.state.wage);
            let handledApiResults = await ApiCalls.handleAPICallResult(apiResult, this);
            this.setState({isLoading: false});
            if (handledApiResults){
                let message = `User "${this.state.firstName} ${this.state.lastName}" was added successfully!`;
                ApiCalls.showToastsInArr([message], {
                    buttonText: "OK",
                    type: "success",
                    position: "top",
                    duration: 10 * 1000
                });
                Alert.alert("User Added!", message);
            }
        }
        //console.log("handledApiResults", handledApiResults);
    }
    checkAndSetState(field, value, regex){
        if (regex.test(value)){
            this.setState({[field]: value, [field + "Validation"]: true});
        }
        else {
            this.setState({[field]: value, [field + "Validation"]: false});
        }
    }
    getFieldValidation(field){
        if (this.state[field].length === 0){
            return {success:false, error:false};
        }
        if (this.state && this.state[field + "Validation"]){
            return {success:true, error:false};
        }
        else {
            return {success:false, error:true};
        }
    }

    renderFieldEntry(obj){
        return (
            <Item floatingLabel
                success={this.getFieldValidation(obj.name).success}
                error={this.getFieldValidation(obj.name).error} >
                <Label>{obj.label}</Label>
                <Input name={obj.name}
                    onChangeText={(value) => this.checkAndSetState(obj.name, value, obj.regex)}
                    value={this.state[obj.name]}
                    onSubmitEditing={this.handleSubmit}
                    keyboardType={obj.keyboardType || "default"}
                    secureTextEntry={obj.secureTextEntry || false}
                />
            </Item>
        );
    }

    render() {
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
                        <Title>Add User</Title>
                    </Body>
                    <Right />
                </Header>

                <Content padder>
                <Container>
                    <Content>
                        <Form>
                            {/* <List
                                dataArray={fieldsArr}
                                renderRow={data =>this.renderFieldEntry(data) }
                            /> */}
                            <Item floatingLabel
                                success={this.getFieldValidation("firstName").success}
                                error={this.getFieldValidation("firstName").error} >
                                <Label>First Name</Label>
                                <Input name="firstName"
                                    onChangeText={(value) => this.checkAndSetState("firstName", value, /^.+$/)}
                                    value={this.state.firstName}
                                    onSubmitEditing={this.handleSubmit}
                                />
                            </Item>
                            <Item floatingLabel
                                success={this.getFieldValidation("lastName").success}
                                error={this.getFieldValidation("lastName").error} >
                                <Label>Last Name</Label>
                                <Input name="lastName"
                                    onChangeText={(value) => this.checkAndSetState("lastName", value, /^.+$/)}
                                    value={this.state.lastName}
                                    onSubmitEditing={this.handleSubmit}
                                />
                            </Item>
                            <Item floatingLabel
                                success={this.getFieldValidation("email").success}
                                error={this.getFieldValidation("email").error} >
                                <Label>Email</Label>
                                <Input name="email"
                                    onChangeText={(value) => this.checkAndSetState("email", value, /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)}
                                    value={this.state.email}
                                    onSubmitEditing={this.handleSubmit}
                                    keyboardType="email-address"
                                />
                            </Item>
                            <Item floatingLabel
                                success={this.getFieldValidation("phoneNumber").success}
                                error={this.getFieldValidation("phoneNumber").error} >
                                <Label>Phone Number</Label>
                                <Input name="phoneNumber"
                                    onChangeText={(value) => this.checkAndSetState("phoneNumber", value, /^\d{10}$/)}
                                    value={this.state.phoneNumber}
                                    keyboardType={Platform.OS === "android" ? "phone-pad" : "number-pad"}
                                    onSubmitEditing={this.handleSubmit}
                                />
                            </Item>
                            <Item floatingLabel
                                success={this.getFieldValidation("address").success}
                                error={this.getFieldValidation("address").error} >
                                <Label>Address</Label>
                                <Input name="address"
                                    onChangeText={(value) => this.checkAndSetState("address", value, /^.*$/)}
                                    value={this.state.address}
                                    onSubmitEditing={this.handleSubmit}
                                />
                            </Item>
                            <Item floatingLabel
                                success={this.getFieldValidation("wage").success}
                                error={this.getFieldValidation("wage").error} >
                                <Label>Wage</Label>
                                <Input name="wage"
                                    onChangeText={(value) => this.checkAndSetState("wage", value, /^\d+(.\d+)?$/)}
                                    value={this.state.wage}
                                    keyboardType="numeric"
                                    onSubmitEditing={this.handleSubmit}
                                />
                            </Item>
                            <Item floatingLabel
                                success={this.getFieldValidation("username").success}
                                error={this.getFieldValidation("username").error} >
                                <Label>Username</Label>
                                <Input name="username"
                                    onChangeText={(value) => this.checkAndSetState("username", value, /^.+$/)}
                                    value={this.state.username}
                                    onSubmitEditing={this.handleSubmit}
                                />
                            </Item>
                            <Item floatingLabel
                                success={this.getFieldValidation("password").success}
                                error={this.getFieldValidation("password").error} >
                                <Label>Password</Label>
                                <Input name="password" secureTextEntry
                                    onChangeText={(value) => this.checkAndSetState("password", value, /^(?=(?:[^A-Z]*[A-Z]){1})(?=[^!@#$&*]*[!@#$&*])(?=(?:[^0-9]*[0-9]){1}).{8,}$/)}
                                    value={this.state.password}
                                    onSubmitEditing={this.handleSubmit}
                                />
                                </Item>
                            <Button
                                block style={{ margin: 15, marginTop: 50 }}
                                onPress={this.handleSubmit}
                            >
                                <Text>Add User</Text>
                            </Button>
                        </Form>
                    </Content>
                </Container>
                </Content>
            </Container>
        );
    }
}

export default AddUser;
