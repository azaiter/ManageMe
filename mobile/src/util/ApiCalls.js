const apiURL = "https://api.manageme.tech";
const Auth = require("../util/Auth");

let callHandler = async function (params) {
    const ApiError = callHandler.caller.name.slice(0, callHandler.caller.name.length - 1);
    return new Promise((resolve, reject) => {
        callFetch(params).then(result => {
            if (result[1] !== 200) {
                reject({ [ApiError]: getErrorsListFromObj(result[0]) });
            } else {
                resolve(result[0]);
            }
        }).catch(err => {
            reject({ Error: err.message });
        });
    });
};

let callFetch = async function (params) {
    if (params.url) {
        let tok = await Auth.getLocalToken();
        let bodyObj = (params.body) ? params.body : params;
        if (params.tok !== true) {
            if (bodyObj.paramArr) {
                if (bodyObj.paramArr.constructor === Array) {
                    bodyObj.paramArr = [tok.token].concat(bodyObj.paramArr);
                } else {
                    bodyObj.paramArr = [tok.token];
                }
            } else {
                bodyObj.token = tok.token;
            }
        }
        if (params.body) {
            Object.assign(bodyObj, params.body);
        }
        const res = await fetch(apiURL + params.url, {
            method: params.method || "POST",
            headers: { "content-type": params.contentType || "application/json" },
            body: JSON.stringify(bodyObj)
        });
        const json = await res.json();
        return [json, res.status];
    }
};

let getErrorsListFromObj = function getErrorsListFromObj(obj) {
    let arrToReturn = [];
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            const v = obj[k];
            arrToReturn.push(`${k}: ${v}`);
        }
    }
    return arrToReturn;
};

export async function getToken(params) {
    return await callHandler({
        url: "/user/login",
        tok: true,
        body: {
            username: params.user,
            password: params.pass,
        }
    });
}

export async function getTime() {
    return await callHandler({
        url: "/clock/get"
    });
}

export async function clockIn(params) {
    return await callHandler({
        url: "/clock/in",
        body: {
            req_id: params.reqID
        }
    });
}

export async function clockOut(params) {
    return await callHandler({
        url: "/clock/out",
        body: {
            req_id: params.reqID
        }
    });
}

export async function getEstimate(params) {
    return await callHandler({
        url: "/project/estimate/get",
        body: {
            project_id: params.projId
        }
    });
}

export async function getRequirementEstimates(params) {
    return await callHandler({
        url: "/requirement/estimate/get",
        body: {
            req_id: params.reqId
        }
    });
}

export async function getTimeCaps(params) {
    return await callHandler({
        url: "/project/timecaps/get",
        body: {
            project_id: params.projId
        }
    });
}

export async function getProjects() {
    return await callHandler({
        url: "/project/get"
    });
}

export async function getProjectHours(params) {
    return await callHandler({
        url: "/project/hours/get",
        body: {
            uid: params.projId
        }
    });
}

export async function getMyInfo() {
    return await callHandler({
        url: "/util/custom",
        body: {
            spName: "sp_getMyInfo"
        }
    });
}

export async function getUserInfoByUserId(params) {
    return await callHandler({
        url: "/user/get",
        body: {
            userID: params.userId
        }
    });
}

export async function getUserInfo() {
    return await callHandler({
        url: "/user/get"
    });
}

export async function getRequirementById(params) {
    return await callHandler({
        url: "/requirement/get",
        body: {
            reqID: params.reqId
        }
    });
}

export async function getRequirements() {
    return await callHandler({
        url: "/requirement/get"
    });
}

export async function getTeamById(params) {
    return await callHandler({
        url: "/team/get",
        body: {
            teamID: params.teamId
        }
    });
}

export async function getTeams() {
    return await callHandler({
        url: "/team/get"
    });
}

export async function getRequirementsByProjectId(params) {
    return await callHandler({
        url: "/project/req/get",
        body: {
            project_uid: params.projectId
        }
    });
}

export async function getAllPerms() {
    return await callHandler({
        url: "/privilage/get"
    });
}

import "babel-polyfill";

export async function createUser(params) {
    return await callHandler({
        url: "/user/create",
        tok: true,
        body: {
            first_name: params.first,
            last_name: params.last,
            email: params.mail,
            phonenum: params.num,
            address: params.addr,
            username: params.user,
            password: params.pass,
            wage: params.wage
        }
    });
}

export async function createProject(params) {
    return await callHandler({
        url: "/project/create",
        body: {
            project_name: params.projectName,
            project_desc: params.projectDesc,
            team_id: params.teamId
        }
    });
}

export async function createTeam(params) {
    return await callHandler({
        url: "/team/create",
        body: {
            team_name: params.teamName,
            team_desc: params.desc,
        }
    });
}

export async function deleteTeam(params) {
    return await callHandler({
        url: "/team/delete",
        body: {
            team_id: params.teamId
        }
    });
}

export async function assignPrivilage(params) {
    return await callHandler({
        url: "/privilage/assign",
        body: {
            privilage_id: params.privilageId,
            affected_user_id: params.affectedUserId,
        }
    });
}

export async function revokePrivilage(params) {
    return await callHandler({
        url: "/privilage/revoke",
        body: {
            privilage_id: params.privilageId,
            affected_user_id: params.affectedUserId,
        }
    });
}

export async function disableUser(params) {
    return await callHandler({
        url: "/user/disable",
        body: {
            user_id: params.userId
        }
    });
}

export async function createRequirement(params) {
    return await callHandler({
        url: "/requirement/create",
        body: {
            proj_id: params.projId,
            estimate: params.est,
            desc: params.reqDesc,
            name: params.reqName,
            softcap: params.reqSoft,
            hardcap: params.reqHard,
            priority: params.reqPriority
        }
    });
}

export async function removeUserFromTeam(params) {
    return await callHandler({
        url: "/team/member/delete",
        body: {
            teamID: params.teamId,
            user_id: params.userId
        }
    });
}

export async function addUserToTeam(params) {
    return await callHandler({
        url: "/team/member/create",
        body: {
            teamID: params.teamId,
            user_id: params.userId
        }
    });
}

export async function getTeamMembers(params) {
    return await callHandler({
        url: "/team/member/get",
        body: {
            teamID: params.teamId
        }
    });
}

export async function createRequirementEstimate(params) {
    return await callHandler({
        url: "/requirement/estimate/create",
        body: {
            reqID: params.reqId,
            estimateAmt: params.estAmt
        }
    });
}

export async function updateProject(params) {
    return await callHandler({
        url: "/project/update",
        body: {
            project_id: params.projId,
            project_name: params.projName,
            project_desc: params.projDesc
        }
    });
}

export async function updateUser(params) {
    return await callHandler({
        url: "/user/update",
        body: {
            user_id: params.userId,
            first_name: params.firstName,
            last_name: params.lastName,
            email: params.email,
            phone: params.phoneNumber,
            address: params.address,
            wage: params.wage
        }
    });
}

export async function deleteProject(params) {
    return await callHandler({
        url: "/project/delete",
        body: {
            project_id: params.projectId
        }
    });
}

export async function deleteReq(params) {
    return await callHandler({
        url: "/req/delete",
        body: {
            req_id: params.reqId
        }
    });
}

export async function deleteUser(params) {
    return await callHandler({
        url: "/user/delete",
        body: {
            user_id: params.userId
        }
    });
}

export async function updateRequirement(params) {
    return await callHandler({
        url: "/req/update",
        body: {
            req_id: params.eqId,
            [params.cellName]: params.cellValue
        }
    });
}

export async function getRecentRequirements() {
    return await callHandler({
        url: "/util/custom",
        body: {
            spName: "sp_getRecentReqs"
        }
    });
}
export async function enabledDisableUser(params) {
    return await callHandler({
        url: "/util/custom",
        body: {
            paramArr: [params.userId, params.enabled],
            spName: "sp_updateUserEnabled"
        }
    });
}

export async function completeReq(params) {
    return await callHandler({
        url: "/util/custom",
        tok: true,
        body: {
            paramArr: [params.req],
            spName: "sp_completeReq",
        }
    });
}

export async function getProjectInfo(params) {
    return await callHandler({
        url: "/util/custom",
        body: {
            paramArr: [params.proj_id],
            spName: "sp_getProjectInfo",
        }
    });
}

export async function getProjectsWithApproval() {
    return await callHandler({
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getProjectsWithPendingApprovalReqs",
        }
    });
}

export async function getAllTeams() {
    return await callHandler({
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getAllTeams2",
        }
    });
}

export async function getRecentProjects() {
    return await callHandler({
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getRecentProjects",
        }
    });
}

export async function getRecentActivity() {
    return await callHandler({
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getRecentActivity",
        }
    });
}

export async function updateUserInfo(params) {
    return await callHandler({
        url: "/util/custom",
        body: {
            paramArr: [
                params.firstName,
                params.lastName,
                params.email,
                params.phoneNumber,
                params.address,
                params.uid
            ],
            spName: "sp_updateMyInfo"
        }
    });
}

export async function getDashboardCardInfo(params) {
    return await callHandler({
        url: "/user/systeminfo/get",
        body: {
            user_uid: params.uid
        }
    });
}

export async function createChangeRequest(params) {
    return await callHandler({
        url: "/req/changerequest/create",
        body: {
            OldreqID: params.OldreqID,
            estimate: params.estimate,
            desc: params.desc,
            name: params.name,
            softcap: params.softcap,
            hardcap: params.hardcap,
            priority: params.priority
        }
    });
}

export async function acceptChangeRequest(params) {
    return await callHandler({
        url: "/req/changerequest/accept",
        body: {
            reqID: params.reqID
        }
    });
}

export async function rejectChangeRequest(params) {
    return await callHandler({
        url: "/req/changerequest/reject",
        body: {
            reqID: params.reqID
        }
    });
}

export async function getWeeklyHours() {
    return await callHandler({
        url: "/clock/weeklyhrs/get"
    });
}

export async function makeTeamLead(params) {
    return await callHandler({
        url: "/team/member/lead",
        body: {
            teamID: params.teamId,
            user_id: params.userId
        }
    });
}

export async function getUserPerms(params) {
    return await callHandler({
        url: "/privilage/get",
        body: {
            user_id: params.userId
        }
    });
}

export async function addProjectComment(params) {
    return await callHandler({
        url: "/project/comments/add",
        body: {
            projID: params.projID,
            comment: params.comment
        }
    });
}

export async function addReqComment(params) {
    return await callHandler({
        url: "/req/comments/add",
        body: {
            reqID: params.reqID,
            comment: params.comment
        }
    });
}

export async function getProjectComments(params) {
    return await callHandler({
        url: "/project/comments/get",
        body: {
            projID: params.projID
        }
    });
}

export async function getReqComments(params) {
    return await callHandler({
        url: "/req/comments/get",
        body: {
            reqID: params.reqID
        }
    });
}

export async function getTeamReport(params) {
    return await callHandler({
        url: "/user/wage/get",
        body: {
            teamID: params.teamId
        }
    });
}
