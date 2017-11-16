import {getToken, createUser} from '../utils/HttpHelper'


export function login(username, password){
    getToken(username, password).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);  
    });
}


export function register(first_name, last_name, email, phonenum, address, username, password){
    createUser(first_name, last_name, email, phonenum, address, username, password)
    .then(res =>{
        console.log(res.message.phonenum);
    }).catch(err => {
        console.log(err);
    })
}