import 'babel-polyfill'

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

export async function createTeam(tok, teamName, desc) {
    let res = await fetch('https://api.manageme.tech/team/create', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            team_name: teamName,
            team_desc: desc,
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

export async function getTime(tok){
    let res = await fetch('https://api.manageme.tech/clock/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function clockIn(tok){
    let res = await fetch('https://api.manageme.tech/clock/in', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function clockOut(tok){
    let res = await fetch('https://api.manageme.tech/clock/out', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function assignPrivilage(tok, privilageId, affectedUserId){
    let res = await fetch('https://api.manageme.tech/privilage/assign', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            privilage_id: privilageId,
            affected_user_id: affectedUserId
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function revokePrivilage(tok, privilageId, affectedUserId){
    let res = await fetch('https://api.manageme.tech/privilage/revoke', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            privilage_id: privilageId,
            affected_user_id: affectedUserId
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getEstimate(tok, projId){
    let res = await fetch('https://api.manageme.tech/project/estimate/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok, 
            project_id: projId
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getRequirementEstimates(tok, reqId){
    let res = await fetch('https://api.manageme.tech/requirement/estimate/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok, 
            req_id: reqId
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getTimeCaps(tok, projId){
    let res = await fetch('https://api.manageme.tech/project/timecaps/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok, 
            project_id: projId
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getProjects(tok){
    let res = await fetch('https://api.manageme.tech/project/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok, 
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getProjectHours(tok, projId){
    let res = await fetch('https://api.manageme.tech/project/hours/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            uid: projId 
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function disableUser(tok, userId){
    let res = await fetch('https://api.manageme.tech/user/disable', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            user_id: userId 
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getUserInfoByUserId(tok, userId){
    let res = await fetch('https://api.manageme.tech/user/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok, 
            userID: userId
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getUserInfo(tok){
    let res = await fetch('https://api.manageme.tech/user/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function createRequirement(tok, est, reqDesc, reqName, reqSoft, reqHard, reqPriority){
    let res = await fetch('https://api.manageme.tech/requirement/create', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok, 
            estimate: est, 
            desc: reqDesc, 
            name: reqName, 
            softcap: reqSoft, 
            hardcap: reqHard, 
            priority: reqPriority
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getRequirementById(tok, reqId){
    let res = await fetch('https://api.manageme.tech/requirement/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            reqID: reqId
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getRequirements(tok){
    let res = await fetch('https://api.manageme.tech/requirement/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getTeamById(tok, teamId){
    let res = await fetch('https://api.manageme.tech/team/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            teamID: teamId
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function getTeams(tok){
    let res = await fetch('https://api.manageme.tech/team/get', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function createRequirementEstimate(tok, reqId, estAmt){
    let res = await fetch('https://api.manageme.tech/requirement/estimate/create', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            reqID: reqId,
            estimateAmt: estAmt
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function updateProject(tok, projId, projName, projDesc){
    let res = await fetch('https://api.manageme.tech/project/update ', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok, 
            project_id: projId, 
            project_name: projName, 
            project_desc: projDesc
        })
    });
    let json = await res.json();
    return [json, res.status];
}

export async function deleteProject(tok, projectId){
    let res = await fetch('https://api.manageme.tech/project/delete', {
        method: 'POST',
        headers: 
        {'content-type': 'application/json' },
        body: JSON.stringify({
            token: tok,
            project_id: projectId
        })
    });
    let json = await res.json();
    return [json, res.status];
}




