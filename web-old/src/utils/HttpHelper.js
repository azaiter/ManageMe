import 'babel-polyfill';

export async function createUser(first, last, mail, num, addr, user, pass) {
  const res = await fetch('https://api.manageme.tech/user/create', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      first_name: first,
      last_name: last,
      email: mail,
      phonenum: num,
      address: addr,
      username: user,
      password: pass,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function createProject(tok, projectName, projectDesc, teamId) {
  const res = await fetch('https://api.manageme.tech/project/create', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      project_name: projectName,
      project_desc: projectDesc,
      team_id: teamId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function createTeam(tok, teamName, desc) {
  const res = await fetch('https://api.manageme.tech/team/create', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      team_name: teamName,
      team_desc: desc,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getToken(user, pass) {
  const res = await fetch('https://api.manageme.tech/user/login', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: user,
      password: pass,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getTime(tok) {
  const res = await fetch('https://api.manageme.tech/clock/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function clockIn(tok, reqID) {
  const res = await fetch('https://api.manageme.tech/clock/in', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      req_id: reqID,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function clockOut(tok, reqID) {
  const res = await fetch('https://api.manageme.tech/clock/out', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      req_id: reqID,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function deleteTeam(tok, teamId) {
  const res = await fetch('https://api.manageme.tech/team/delete', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      team_id: teamId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function assignPrivilage(tok, privilageId, affectedUserId) {
  const res = await fetch('https://api.manageme.tech/privilage/assign', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      privilage_id: privilageId,
      affected_user_id: affectedUserId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function revokePrivilage(tok, privilageId, affectedUserId) {
  const res = await fetch('https://api.manageme.tech/privilage/revoke', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      privilage_id: privilageId,
      affected_user_id: affectedUserId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getEstimate(tok, projId) {
  const res = await fetch('https://api.manageme.tech/project/estimate/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      project_id: projId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getRequirementEstimates(tok, reqId) {
  const res = await fetch('https://api.manageme.tech/requirement/estimate/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      req_id: reqId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getTimeCaps(tok, projId) {
  const res = await fetch('https://api.manageme.tech/project/timecaps/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      project_id: projId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getProjects(tok) {
  const res = await fetch('https://api.manageme.tech/project/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getProjectHours(tok, projId) {
  const res = await fetch('https://api.manageme.tech/project/hours/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      uid: projId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function disableUser(tok, userId) {
  const res = await fetch('https://api.manageme.tech/user/disable', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      user_id: userId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getUserInfoByUserId(tok, userId) {
  const res = await fetch('https://api.manageme.tech/user/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      userID: userId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getUserInfo(tok) {
  const res = await fetch('https://api.manageme.tech/user/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function createRequirement(tok, projId, est, reqDesc, reqName, reqSoft, reqHard, reqPriority) {
  const res = await fetch('https://api.manageme.tech/requirement/create', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      proj_id: projId,
      estimate: est,
      desc: reqDesc,
      name: reqName,
      softcap: reqSoft,
      hardcap: reqHard,
      priority: reqPriority,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getRequirementById(tok, reqId) {
  const res = await fetch('https://api.manageme.tech/requirement/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      reqID: reqId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getRequirements(tok) {
  const res = await fetch('https://api.manageme.tech/requirement/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function removeUserFromTeam(tok, teamId, userId) {
  const res = await fetch('https://api.manageme.tech/team/member/delete', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      teamID: teamId,
      user_id: userId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function addUserToTeam(tok, teamId, userId) {
  const res = await fetch('https://api.manageme.tech/team/member/create', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      teamID: teamId,
      user_id: userId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getTeamById(tok, teamId) {
  const res = await fetch('https://api.manageme.tech/team/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      teamID: teamId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getTeamMembers(tok, teamId) {
  const res = await fetch('https://api.manageme.tech/team/member/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      teamID: teamId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getTeams(tok) {
  const res = await fetch('https://api.manageme.tech/team/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function createRequirementEstimate(tok, reqId, estAmt) {
  const res = await fetch('https://api.manageme.tech/requirement/estimate/create', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      reqID: reqId,
      estimateAmt: estAmt,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function updateProject(tok, projId, projName, projDesc) {
  const res = await fetch('https://api.manageme.tech/project/update ', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      project_id: projId,
      project_name: projName,
      project_desc: projDesc,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function updateUser(tok, userId, cellName, cellValue) {
  const res = await fetch('https://api.manageme.tech/user/update', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      user_id: userId,
      [cellName]: cellValue,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function deleteProject(tok, projectId) {
  const res = await fetch('https://api.manageme.tech/project/delete', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      project_id: projectId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}


export async function getRequirementsByProjectId(tok, projectId) {
  const res = await fetch('https://api.manageme.tech/project/req/get', {
    method: 'POST',
    headers:
        { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      project_uid: projectId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function deleteReq(tok, reqId) {
  const res = await fetch('https://api.manageme.tech/req/delete', {
    method: 'POST',
    headers:
          { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      req_id: reqId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function deleteUser(tok, userId) {
  const res = await fetch('https://api.manageme.tech/user/delete', {
    method: 'POST',
    headers:
            { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      user_id: userId,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function updateRequirement(tok, reqId, cellName, cellValue) {
  const res = await fetch('https://api.manageme.tech/req/update', {
    method: 'POST',
    headers:
          { 'content-type': 'application/json' },
    body: JSON.stringify({
      token: tok,
      req_id: reqId,
      [cellName]: cellValue,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}

export async function getAllPerms(token) {
  const res = await fetch('https://api.manageme.tech/privilage/get', {
    method: 'POST',
    headers:
            { 'content-type': 'application/json' },
    body: JSON.stringify({
      token,
    }),
  });
  const json = await res.json();
  return [json, res.status];
}
