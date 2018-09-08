import { AsyncStorage } from "react-native";

export const loginTokenASKey = "@app:loginTokenObj";

export async function getLocalToken() {
    let token = await AsyncStorage.getItem(loginTokenASKey);
    return token;
}

export async function logout(component) {
    await removeLocalToken();
    component.setState({ loggedIn: false });
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

export async function setIsLoginStateOnScreenEntry(component, opts={}) {
    let isClientLoggedIn = await isLoggedIn();
    if (isClientLoggedIn){
        component.setState({ loggedIn: true });
        if (opts.navigate){
            component.props.navigation.navigate(opts.navigate);
        }
    }
    else {
        if (!opts.dontGoHome){
            component.props.navigation.navigate("Home");
        }
    }
}

export async function isLoggedIn() {
    return new Promise(async (resolve, reject)=>{
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
