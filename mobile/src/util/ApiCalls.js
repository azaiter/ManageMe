const apiURL = "https://api.manageme.tech";
const Auth = require("../util/Auth");

import { Toast } from "native-base";

let callHandler = async function (component, params) {
    return new Promise((resolve, reject) => {
        callFetch(params).then(result => {
            if (result[1] !== 200) {
                handleError(component, result[0]);
                reject({ err: result[0] });
            } else {
                resolve(result[0]);
            }
        }).catch(err => {
            handleError(component, err.message);
            reject({ err: err.message });
        });
    });
};

let callFetch = async function (params) {
    if (params.url) {
        let tok = await Auth.getLocalToken();
        let bodyObj = (params.body) ? params.body : params;
        let json = {};
        if (!params.tok) {
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
        try {
            json = await res.json();
        } catch (e) {
            json = { err: e.message };
        }
        return [json, res.status || 501];
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

let showToastsInArr = function (arr, params = {}) {
    arr.forEach(message => {
        Toast.show({
            text: message,
            buttonText: params.buttonText || "okay",
            type: params.type || "warning",
            position: params.position || "top",
            duration: params.duration || 5000
        });
    });
};

let handleError = function (component, result) {
    let errorsArr = getErrorsListFromObj(result);
    component.setState({ ApiErrorsList: errorsArr });
    showToastsInArr(errorsArr);
};

export async function getToken(component, params) {
    return await callHandler(component, {
        url: "/user/login",
        tok: true,
        body: {
            username: params.user,
            password: params.pass,
        }
    });
}

export async function getTime(component) {
    return await callHandler(component, {
        url: "/clock/get"
    });
}

export async function clockIn(component, params) {
    return await callHandler(component, {
        url: "/clock/in",
        body: {
            req_id: params.reqID
        }
    });
}

export async function clockOut(component, params) {
    return await callHandler(component, {
        url: "/clock/out",
        body: {
            req_id: params.reqID
        }
    });
}

export async function getEstimate(component, params) {
    return await callHandler(component, {
        url: "/project/estimate/get",
        body: {
            project_id: params.projId
        }
    });
}

export async function getRequirementEstimates(component, params) {
    return await callHandler(component, {
        url: "/requirement/estimate/get",
        body: {
            req_id: params.reqId
        }
    });
}

export async function getTimeCaps(component, params) {
    return await callHandler(component, {
        url: "/project/timecaps/get",
        body: {
            project_id: params.projId
        }
    });
}

export async function getProjects(component) {
    return await callHandler(component, {
        url: "/project/get"
    });
}

export async function getProjectHours(component, params) {
    return await callHandler(component, {
        url: "/project/hours/get",
        body: {
            uid: params.projId
        }
    });
}

export async function getMyInfo(component) {
    return await callHandler(component, {
        url: "/util/custom",
        body: {
            spName: "sp_getMyInfo"
        }
    });
}

export async function getUserInfoByUserId(component, params) {
    return await callHandler(component, {
        url: "/user/get",
        body: {
            userID: params.userId
        }
    });
}

export async function getUserInfo(component) {
    return await callHandler(component, {
        url: "/user/get"
    });
}

export async function getRequirementById(component, params) {
    return await callHandler(component, {
        url: "/requirement/get",
        body: {
            reqID: params.reqId
        }
    });
}

export async function getRequirements(component) {
    return await callHandler(component, {
        url: "/requirement/get"
    });
}

export async function getTeamById(component, params) {
    return await callHandler(component, {
        url: "/team/get",
        body: {
            teamID: params.teamId
        }
    });
}

export async function getTeams(component) {
    return await callHandler(component, {
        url: "/team/get"
    });
}

export async function getRequirementsByProjectId(component, params) {
    return await callHandler(component, {
        url: "/project/req/get",
        body: {
            project_uid: params.projectId
        }
    });
}

export async function getAllPerms(component) {
    return await callHandler(component, {
        url: "/privilage/get"
    });
}

import "babel-polyfill";

export async function createUser(component, params) {
    return await callHandler(component, {
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

export async function createProject(component, params) {
    return await callHandler(component, {
        url: "/project/create",
        body: {
            project_name: params.projectName,
            project_desc: params.projectDesc,
            team_id: params.teamId
        }
    });
}

export async function createTeam(component, params) {
    return await callHandler(component, {
        url: "/team/create",
        body: {
            team_name: params.teamName,
            team_desc: params.desc,
        }
    });
}

export async function deleteTeam(component, params) {
    return await callHandler(component, {
        url: "/team/delete",
        body: {
            team_id: params.teamId
        }
    });
}

export async function assignPrivilage(component, params) {
    return await callHandler(component, {
        url: "/privilage/assign",
        body: {
            privilage_id: params.privilageId,
            affected_user_id: params.affectedUserId,
        }
    });
}

export async function revokePrivilage(component, params) {
    return await callHandler(component, {
        url: "/privilage/revoke",
        body: {
            privilage_id: params.privilageId,
            affected_user_id: params.affectedUserId,
        }
    });
}

export async function disableUser(component, params) {
    return await callHandler(component, {
        url: "/user/disable",
        body: {
            user_id: params.userId
        }
    });
}

export async function createRequirement(component, params) {
    return await callHandler(component, {
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

export async function removeUserFromTeam(component, params) {
    return await callHandler(component, {
        url: "/team/member/delete",
        body: {
            teamID: params.teamId,
            user_id: params.userId
        }
    });
}

export async function addUserToTeam(component, params) {
    return await callHandler(component, {
        url: "/team/member/create",
        body: {
            teamID: params.teamId,
            user_id: params.userId
        }
    });
}

export async function getTeamMembers(component, params) {
    return await callHandler(component, {
        url: "/team/member/get",
        body: {
            teamID: params.teamId
        }
    });
}

export async function createRequirementEstimate(component, params) {
    return await callHandler(component, {
        url: "/requirement/estimate/create",
        body: {
            reqID: params.reqId,
            estimateAmt: params.estAmt
        }
    });
}

export async function updateProject(component, params) {
    return await callHandler(component, {
        url: "/project/update",
        body: {
            project_id: params.projId,
            project_name: params.projName,
            project_desc: params.projDesc
        }
    });
}

export async function updateUser(component, params) {
    return await callHandler(component, {
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

export async function deleteProject(component, params) {
    return await callHandler(component, {
        url: "/project/delete",
        body: {
            project_id: params.projectId
        }
    });
}

export async function deleteReq(component, params) {
    return await callHandler(component, {
        url: "/req/delete",
        body: {
            req_id: params.reqId
        }
    });
}

export async function deleteUser(component, params) {
    return await callHandler(component, {
        url: "/user/delete",
        body: {
            user_id: params.userId
        }
    });
}

export async function updateRequirement(component, params) {
    return await callHandler(component, {
        url: "/req/update",
        body: {
            req_id: params.eqId,
            [params.cellName]: params.cellValue
        }
    });
}

export async function getRecentRequirements(component) {
    return await callHandler(component, {
        url: "/util/custom",
        body: {
            spName: "sp_getRecentReqs"
        }
    });
}
export async function enabledDisableUser(component, params) {
    return await callHandler(component, {
        url: "/util/custom",
        body: {
            paramArr: [params.userId, params.enabled],
            spName: "sp_updateUserEnabled"
        }
    });
}

export async function completeReq(component, params) {
    return await callHandler(component, {
        url: "/util/custom",
        tok: true,
        body: {
            paramArr: [params.req],
            spName: "sp_completeReq",
        }
    });
}

export async function getProjectInfo(component, params) {
    return await callHandler(component, {
        url: "/util/custom",
        body: {
            paramArr: [params.proj_id],
            spName: "sp_getProjectInfo",
        }
    });
}

export async function getProjectsWithApproval(component) {
    return await callHandler(component, {
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getProjectsWithPendingApprovalReqs",
        }
    });
}

export async function getAllTeams(component) {
    return await callHandler(component, {
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getAllTeams2",
        }
    });
}

export async function getRecentProjects(component) {
    return await callHandler(component, {
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getRecentProjects",
        }
    });
}

export async function getRecentActivity(component) {
    return await callHandler(component, {
        url: "/util/custom",
        body: {
            paramArr: true,
            spName: "sp_getRecentActivity",
        }
    });
}

export async function updateUserInfo(component, params) {
    return await callHandler(component, {
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

export async function getDashboardCardInfo(component, params) {
    return await callHandler(component, {
        url: "/user/systeminfo/get",
        body: {
            user_uid: params.uid
        }
    });
}

export async function createChangeRequest(component, params) {
    return await callHandler(component, {
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

export async function acceptChangeRequest(component, params) {
    return await callHandler(component, {
        url: "/req/changerequest/accept",
        body: {
            reqID: params.reqID
        }
    });
}

export async function rejectChangeRequest(component, params) {
    return await callHandler(component, {
        url: "/req/changerequest/reject",
        body: {
            reqID: params.reqID
        }
    });
}

export async function getWeeklyHours(component) {
    return await callHandler(component, {
        url: "/clock/weeklyhrs/get"
    });
}

export async function makeTeamLead(component, params) {
    return await callHandler(component, {
        url: "/team/member/lead",
        body: {
            teamID: params.teamId,
            user_id: params.userId
        }
    });
}

export async function getUserPerms(component, params) {
    return await callHandler(component, {
        url: "/privilage/get",
        body: {
            user_id: params.userId
        }
    });
}

export async function addProjectComment(component, params) {
    return await callHandler(component, {
        url: "/project/comments/add",
        body: {
            projID: params.projID,
            comment: params.comment
        }
    });
}

export async function addReqComment(component, params) {
    return await callHandler(component, {
        url: "/req/comments/add",
        body: {
            reqID: params.reqID,
            comment: params.comment
        }
    });
}

export async function getProjectComments(component, params) {
    return await callHandler(component, {
        url: "/project/comments/get",
        body: {
            projID: params.projID
        }
    });
}

export async function getReqComments(component, params) {
    return await callHandler(component, {
        url: "/req/comments/get",
        body: {
            reqID: params.reqID
        }
    });
}

export async function getTeamReport(component, params) {
    return await callHandler(component, {
        url: "/user/wage/get",
        body: {
            teamID: params.teamId
        }
    });
}
