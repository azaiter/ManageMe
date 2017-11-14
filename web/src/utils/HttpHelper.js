import Axios from 'Axios'

export async function validateToken(token) {
    let valid = await Axios.post('/api/is_token_valid', {
        token,
    });
    return valid.data
}

export async function createUser(first, last, email, username, password) {
    let res = await Axios.post('api.manageme.tech/user/create', {
        first,
        last,
        email,
        username,
        password
    });
    return res.data;
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

export function getToken(email, password) {
    return Axios.post('http://api.manageme.tech/user/get', {
        email,
        password,
    });
}

