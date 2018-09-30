import { AsyncStorage } from "react-native";

const ApiCalls = require("./ApiCalls");

export const loginTokenASKey = "@app:loginTokenObj";
export const userPermissionsASKey = "@app:userPermissions";

export async function getLocalToken() {
    let token = await getItem(loginTokenASKey);
    return token;
}

export async function logout(component) {
    await removeLocalToken();
    await AsyncStorage.removeItem(userPermissionsASKey);
    component.setState({ loggedIn: false });
    component.setState({ userPermissions: false });
}

export async function setLocalToken(token) {
    await saveItem(loginTokenASKey, token);
}

export async function getItem(key) {
    return await AsyncStorage.getItem(key)
        .then((result) => {
            if (result) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    // console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
                }
            }
            return result;
        });
}

export function getPermissions(component) {
    if (component.state && component.state.userPermissions) {
        //console.log(component.state.userPermissions)
        return component.state.userPermissions;
    }
    else {
        return [];
    }
}

export function userHasPermission(component, permissionID) {
    return getPermissions(component).filter(perm => perm.uid === permissionID).length > 0;
}

export async function setIsLoginStateOnScreenEntry(component, opts = {}) {
    let isClientLoggedIn = await isLoggedIn();
    if (isClientLoggedIn) {
        if (component && component.state && !component.state.loggedIn) {
            let userToken = await getLocalToken();
            component.setState({ loggedIn: true, userTokenObj: userToken }); // only update state when needed
            if (opts.setUserPermissions) {
                setUserPermissionsOnComponent(component);
            }
        }
        if (opts.navigate) {
            component.props.navigation.navigate(opts.navigate);
        }
    }
    else {
        if (component && component.state && component.state.loggedIn) {
            component.setState({ loggedIn: false }); // only update state when needed
            if (opts.setUserPermissions) {
                setUserPermissionsOnComponent(component);
            }
        }
        if (!opts.dontGoHome) {
            component.props.navigation.navigate("Home");
        }
    }
}

export async function setUserPermissionsOnComponent(component) {
    let isClientLoggedIn = await isLoggedIn();
    let permissionsObj = await getPermissionsObject();
    if (isClientLoggedIn) {
        if (!permissionsObj) {
            let localToken = await getLocalToken();
            //console.log("doing api call permissions")
            let apiResult = await ApiCalls.getUserPerms(localToken.uid);
            let handledApiResults = await ApiCalls.handleAPICallResult(apiResult, component);
            if (handledApiResults) {
                //console.log("UserPermissions: ", handledApiResults);
                permissionsObj = handledApiResults;
            }
        }
        if (component && component.state && !component.state.userPermissions) {
            //console.log("setting state main");
            await saveItem(userPermissionsASKey, permissionsObj);
            component.setState({ userPermissions: permissionsObj }); // only update state when needed
        }
    }
    else {
        if (component && component.state && component.state.userPermissions) {
            //console.log("setting state else");
            component.setState({ userPermissions: false }); // only update state when needed
        }
    }
}

export async function getPermissionsObject() {
    return new Promise(async (resolve, reject) => {
        let permissionsObj = await getItem(userPermissionsASKey);
        //console.log(permissionsObj);
        resolve(permissionsObj ? permissionsObj : false);
    });
}

export async function isLoggedIn() {
    return new Promise(async (resolve, reject) => {
        let sessionObj = await getItem(loginTokenASKey);
        if (sessionObj) {
            let expirationDate = new Date(sessionObj.expire);
            if (new Date().getTime() < expirationDate.getTime()) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }
        else {
            resolve(false);
        }
    });
}

export async function removeLocalToken() {
    await AsyncStorage.removeItem(loginTokenASKey);
}

export async function saveItem(item, selectedValue) {
    try {
        await AsyncStorage.setItem(item, JSON.stringify(selectedValue));
    } catch (error) {
        console.error("AsyncStorage error: " + error.message);
    }
}
