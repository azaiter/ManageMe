const ApiCalls = require("ApiCalls");

export function ApiCallWrapper(apiCall, component, params) {
    console.log("APW: ", apiCall, component, params);
    
    /*return new Promise((resolve, reject) => {
        apiCall(params).then(response => {
            // if mounted is required, check isMounted
                ApiCalls.handleAPICallResult(response, this).then(apiResults => {

                });
            // end if
        });
    });*/
}

/*
    ApiCalls.getRequirementsByProjectId(this.params.uid).then(response => {
        if (this._isMounted) {
            ApiCalls.handleAPICallResult(response, this).then(apiResults => {
*/