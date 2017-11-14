import {getToken} from '../utils/HttpHelper'


export function login(email, password){
    getToken(email, password).then(res => {
        console.log(res);
    });
}


