import { getToken, createUser, getMyInfo } from '../utils/HttpHelper';

function storeToken(token, expiration, uid) {
  localStorage.setItem('token', token);
  localStorage.setItem('expiration', expiration);
  localStorage.setItem('uid', uid);
}

export function deleteStore() {
  localStorage.clear();
}

export function getLocalToken() {
  return localStorage.getItem('token');
}

export function getLocalUid() {
  return localStorage.getItem('uid');
}

export async function userIsLoggedIn() {
  if (localStorage.getItem('token') === null) {
    return false;
  }
  const res = await getMyInfo(localStorage.getItem('token'));
  return res[0].length > 0;
}

export async function login(username, password) {
  return getToken(username, password).then((res) => {
    const json = res[0];
    const status = res[1];
    if (status !== 200) {
      return status;
    }
    console.log(json);
    storeToken(json.token, json.expire, json.uid);
    return status;
  }).catch((err) => {
    console.log('Error:', err);
  });
}


export function register(firstName, lastName, email, phoneNum, address, username, password) {
  return createUser(firstName, lastName, email, phoneNum, address, username, password)
    .then((res) => {
      const json = res[0];
      const status = res[1];
      if (status !== 200) {
        return [json, status];
      }
      return [json, status];
    }).catch((err) => {
      console.log('Error:', err);
    });
}

