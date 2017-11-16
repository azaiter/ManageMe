import Axios from 'Axios'
import 'babel-polyfill'

export async function validateToken(token) {
    let valid = await Axios.post('/api/is_token_valid', {
        token,
    });
    return valid.data
}

export async function createUser(first, last, mail, num, addr, user, pass) {
    let json = await (await fetch('https://api.manageme.tech/user/create', {
        method: 'POST',
        mode: 'cors',
        headers: 
        { 'postman-token': '8faff8ff-741c-7959-4335-e4824578f1bf',
          'cache-control': 'no-cache',
          'content-type': 'application/json' },
        body: JSON.stringify({
          first_name: first,
          last_name: last,
          email: mail,
          phonenum: num,
          address: addr,
          username: user,
          password: pass
        }),
        json: true
      })).json();
    return json;
}

export async function createProject(token, email, projName, projReq, projSoftCap, projHardCap) {
    let res = await Axios.post("api.manageme.tech/project/create", {
        token,
        email,
        projName,
        projReq,
        projSoftCap,
        projHardCap
    });
    return res.data;
}

export async function getToken(user, pass) {
    let json = await(await fetch('https://api.manageme.tech/user/login', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            username: user,
            password: pass,
        })
    })).json();
    return json;
}

