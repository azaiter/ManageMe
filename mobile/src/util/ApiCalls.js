const apiURL = "https://api.manageme.tech";
const Auth = require("../util/Auth");

import { Toast } from "native-base";

callFetch = async function (params) {
    if(params.url) {
        let tok = await Auth.getLocalToken();
        let bodyObj = params.body;
        if(bodyObj.paramArr) {
            if(bodyObj.paramArr.constructor === Array) {
                bodyObj.paramArr = [tok.token].concat(bodyObj.paramArr);
            } else {
                bodyObj.paramArr = [tok.token];
            }
        } else {
            bodyObj.token = tok.token;
        }
        if(params.body) {
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
}

export function getErrorsListFromObj(obj) {
    let arrToReturn = [];
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            const v = obj[k];
            arrToReturn.push(`${k}: ${v}`);
        }
    }
    return arrToReturn;
}

export function showToastsInArr(arr, params = {}) {
    arr.forEach(message => {
        Toast.show({
            text: message,
            buttonText: params.buttonText || "okay",
            type: params.type || "warning",
            position: params.position || "top"
        });
    });
}

export async function handleAPICallResult(result, component) {
    if (result[1] !== 200) {
        let errorsArr = getErrorsListFromObj(result[0]);
        //console.log(getErrorsListFromObj(result[0]));
        component.setState({ ApiErrorsList: errorsArr });
        showToastsInArr(errorsArr);
        return false;
    }
    else {
        return result[0];
    }
}

export async function getToken(user, pass) {
    const res = await fetch(apiURL + "/user/login", {
        method: "POST",
        headers:
            { "content-type": "application/json" },
        body: JSON.stringify({
            username: user,
            password: pass,
        }),
    });
    const json = await res.json();
    return [json, res.status];
}

export async function getTime() {
    return await callFetch({
        url: "/clock/get"
    });
}

export async function clockIn(reqID) {    
    return this.callFetch({
        url: "/clock/in",
        body: {
            req_id: reqID
        }
    });
}

export async function clockOut(reqID) {
    return await callFetch({
        url: "/clock/out",
        body: {
            req_id: reqID
        }
    });
}

export async function getEstimate(projId) {
    return this.callFetch({
        url: "/project/estimate/get",
        body: {
            project_id: projId
        }
    });
}

export async function getRequirementEstimates(reqId) {
    return this.callFetch({
        url: "/requirement/estimate/get",
        body: {
            req_id: reqId
        }
    });
}

export async function getTimeCaps(projId) {
    return this.callFetch({
        url: "/project/timecaps/get",
        body: {
            project_id: projId
        }
    });
}

export async function getProjects() {
    return await callFetch({
        url: "/project/get"
    });
}

export async function getProjectHours(projId) {
    return await callFetch({
        url: "/project/hours/get",
        body: {
            uid: projId
        }
    });
}

export async function getMyInfo() {
    return await callFetch({
        url: "/util/custom",
        body: {
            spName: "sp_getMyInfo"
        }
    });
}

export async function getUserInfoByUserId(userId) {
    return await callFetch({
        url: "/user/get",
        body: {
            userID: userId
        }
    });
}

export async function getUserInfo() {
    return await callFetch({
        url: "/user/get"
    });
}

export async function getRequirementById(reqId) {
    return await callFetch({
        url: "/requirement/get",
        body: {
            reqID: reqId
        }
    });
}

export async function getRequirements() {
    return await callFetch({
        url: "/requirement/get"
    });
}

export async function getTeamById(teamId) {
    return await callFetch({
        url: "/team/get",
        body: {
            teamID: teamId
        }
    });
}

export async function getTeams() {
    return await callFetch({
        url: "/team/get"
    });
}

export async function getRequirementsByProjectId(projectId) {
    return await callFetch({
        url: "/project/req/get",
        body: {
            project_uid: projectId
        }
    });
}

export async function getAllPerms() {
    return await callFetch({
        url: "/privilage/get"
    });
}

import "babel-polyfill";

export async function createUser(first, last, mail, num, addr, user, pass, wage = null) {
    // callFetch incompatible
    const res = await fetch(apiURL + "/user/create", {
        method: "POST",
        headers:
            { "content-type": "application/json" },
        body: JSON.stringify({
            first_name: first,
            last_name: last,
            email: mail,
            phonenum: num,
            address: addr,
            username: user,
            password: pass,
            wage
        }),
    });
    const json = await res.json();
    return [json, res.status];
}

export async function createProject(projectName, projectDesc, teamId) {
    return await callFetch({
        url: "/project/create",
        body: {
            project_name: projectName,
            project_desc: projectDesc,
            team_id: teamId
        }
    });
}

export async function createTeam(teamName, desc) {
    return await callFetch({
        url: "/team/create",
        body: {
            team_name: teamName,
            team_desc: desc,
        }
    });
}

export async function deleteTeam(teamId) {
    return await callFetch({
        url: "/team/delete",
        body: {
            team_id: teamId
        }
    });
}

export async function assignPrivilage(privilageId, affectedUserId) {
    return await callFetch({
        url: "/privilage/assign",
        body: {
            privilage_id: privilageId,
            affected_user_id: affectedUserId,
        }
    });
}

export async function revokePrivilage(privilageId, affectedUserId) {
    return await callFetch({
        url: "/privilage/revoke",
        body: {
            privilage_id: privilageId,
            affected_user_id: affectedUserId,
        }
    });
}

export async function disableUser(userId) {
    return await callFetch({
        url: "/user/disable",
        body: {
            user_id: userId
        }
    });
}

export async function createRequirement(projId, est, reqDesc, reqName, reqSoft, reqHard, reqPriority) {
    return await callFetch({
        url: "/requirement/create",
        body: {
            proj_id: projId,
            estimate: est,
            desc: reqDesc,
            name: reqName,
            softcap: reqSoft,
            hardcap: reqHard,
            priority: reqPriority
        }
    });
}

export async function removeUserFromTeam(teamId, userId) {
    return await callFetch({
        url: "/team/member/delete",
        body: {
            teamID: teamId,
            user_id: userId
        }
    });
}

export async function addUserToTeam(teamId, userId) {
    return await callFetch({
        url: "/team/member/create",
        body: {
            teamID: teamId,
            user_id: userId
        }
    });
}

export async function getTeamMembers(teamId) {
    return await callFetch({
        url: "/team/member/get",
        body: {
            teamID: teamId
        }
    });
}

export async function createRequirementEstimate(reqId, estAmt) {
    return await callFetch({
        url: "/requirement/estimate/create",
        body: {
            reqID: reqId,
            estimateAmt: estAmt
        }
    });
}

export async function updateProject(projId, projName, projDesc) {
    return await callFetch({
        url: "/project/update",
        body: {
            project_id: projId,
            project_name: projName,
            project_desc: projDesc
        }
    });
}

export async function updateUser(userId, cellName, cellValue) {
    return await callFetch({
        url: "/user/update",
        body: {
            user_id: userId,
            [cellName]: cellValue
        }
    });
}

export async function deleteProject(projectId) {
    return await callFetch({
        url: "/project/delete",
        body: {
            project_id: projectId
        }
    });
}

export async function deleteReq(reqId) {
    return await callFetch({
        url: "/req/delete",
        body: {
            req_id: reqId
        }
    });
}

export async function deleteUser(userId) {
    return await callFetch({
        url: "/user/delete",
        body: {
            user_id: userId
        }
    });
}

export async function updateRequirement(reqId, cellName, cellValue) {
    return await callFetch({
        url: "/req/update",
        body: {
            req_id: reqId,
            [cellName]: cellValue
        }
    });
}

export async function getRecentRequirements() {
    return await callFetch({
        url: "/util/custom",
        body: {
            spName: "sp_getRecentReqs"
        }
    });
}

export async function completeReq(req) {
    // callFetch incompatible
    const res = await fetch(apiURL + "/util/custom", {
        method: "POST",
        headers:
            { "content-type": "application/json" },
        body: JSON.stringify({
            paramArr: [req],
            spName: "sp_completeReq",
        }),
    });
    const json = await res.json();
    return [json, res.status];
}

export async function getProjectInfo(proj_id) {
    return await callFetch({
        url: "/util/custom",
        body: {
            paramArr: [proj_id],
            spName: "sp_getProjectInfo",
        }
    });
}

export async function getProjectsWithApproval() {
    return await callFetch({
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getProjectsWithPendingApprovalReqs",
        }
    });
}

export async function getAllTeams() {
    return await callFetch({
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getAllTeams2",
        }
    });
}

export async function getRecentProjects() {
    return await callFetch({
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getRecentProjects",
        }
    });
}

export async function getRecentActivity() {
    return await callFetch({
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getRecentActivity",
        }
    });
}

export async function updateUserInfo(firstName, lastName, email, phoneNumber, address, uid) {
    return await callFetch({
        url: "/util/custom",
        body: {
            paramArr: [firstName, lastName, email, phoneNumber, address, uid],
            spName: "sp_updateMyInfo"
        }
    });
}

export async function getDashboardCardInfo(uid) {
    return await callFetch({
        url: "/user/systeminfo/get",
        body: {
            user_uid: uid
        }
    });
}

export async function createChangeRequest(OldreqID, estimate, desc, name, softcap, hardcap, priority) {
    return await callFetch({
        url: "/req/changerequest/create",
        body: {
            OldreqID,
            estimate,
            desc,
            name,
            softcap,
            hardcap,
            priority
        }
    });
}

export async function acceptChangeRequest(reqID) {
    return await callFetch({
        url: "/req/changerequest/accept",
        body: {
            reqID
        }
    });
}

export async function rejectChangeRequest(reqID) {
    return await callFetch({
        url: "/req/changerequest/reject",
        body: {
            reqID
        }
    });
}

export async function getWeeklyHours() {
    return await callFetch({
        url: "/clock/weeklyhrs/get"
    });
}

export async function makeTeamLead(teamId, userId) {
    return await callFetch({
        url: "/team/member/lead",
        body: {
            teamID: teamId,
            user_id: userId
        }
    });
}

export async function getUserPerms(userId) {
    return await callFetch({
        url: "/privilage/get",
        body: {
            user_id: userId
        }
    });
}

export async function addProjectComment(projID, comment) {
    return await callFetch({
        url: "/project/comments/add",
        body: {
            projID,
            comment
        }
    });
}

export async function addReqComment(reqID, comment) {
    return await callFetch({
        url: "/req/comments/add",
        body: {
            reqID,
            comment
        }
    });
}

export async function getProjectComments(projID) {
    return await callFetch({
        url: "/project/comments/get",
        body: {
            projID
        }
    });
}

export async function getReqComments(reqID) {
    return await callFetch({
        url: "/req/comments/get",
        body: {
            reqID
        }
    });
}

export async function getTeamReport(token, teamId) {
    return await callFetch({
        url: "/user/wage/get",
        body: {
            teamID: teamId
        }
    });
}