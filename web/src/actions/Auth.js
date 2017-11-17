import {getToken, createUser} from '../utils/HttpHelper'

function storeToken(token, expiration){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration);
}

function storeUserDetails(firstName, email){
    localStorage.setItem('name', firstName);
    localStorage.setItem('email', email);
}

export async function login(username, password){
    return getToken(username, password).then(res => {
        let json = res[0];
        let status = res[1];
        if(status != 200){
            return status;
        }
        storeToken(json.token, json.expire);
        return status;
    }).catch(err => {
        console.log("Error:", err);
    });
}


export function register(firstName, lastName, email, phoneNum, address, username, password){
    return createUser(firstName, lastName, email, phoneNum, address, username, password)
    .then(res =>{
        let json = res[0];
        let status = res[1];
        if(status != 200){
            return json, status;
        }
        console.log(firstName, email)
        storeUserDetails(firstName, email);
        return status;
    }).catch(err => {
        console.log("Error:",err);
    })
}