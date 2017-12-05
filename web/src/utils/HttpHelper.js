import 'babel-polyfill'

// export async function validateToken(token) {
//     let valid = await Axios.post('/api/is_token_valid', {
//         token,
//     });
//     return valid.data
// }

export async function createUser(first, last, mail, num, addr, user, pass) {
    let res = await fetch('https://api.manageme.tech/user/create', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
          first_name: first,
          last_name: last,
          email: mail,
          phonenum: num,
          address: addr,
          username: user,
          password: pass
        })
      });
    let json = await res.json();
    return [json, res.status];
}

export async function createProject(tok, projectName, projectDesc) {
    let res = await fetch('https://api.manageme.tech/project/create', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            project_name: projectName,
            project_desc: projectDesc,
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function createTeam(tok, teamName, users) {
    let res = await fetch('https://api.manageme.tech/team/create', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            team_name: teamName,
            users: users,
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getToken(user, pass) {
    let res = await fetch('https://api.manageme.tech/user/login', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            username: user,
            password: pass,
        })
    });
    let json = await res.json();
    return [json, res.status];
}

