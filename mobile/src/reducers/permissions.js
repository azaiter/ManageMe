export const GET_PERMISSIONS = "manageme/permissions/LOAD";
export const GET_PERMISSIONS_SUCCESS = "manageme/permissions/LOAD_SUCCESS";
export const GET_PERMISSIONS_FAIL = "manageme/permissions/LOAD_FAIL";

export default function reducer(state = { permissions: [] }, action) {
    switch (action.type) {
        case GET_PERMISSIONS:
            return { ...state, loading: true };
        case GET_PERMISSIONS_SUCCESS:
            return { ...state, loading: false, permissions: action.payload.data };
        case GET_PERMISSIONS_FAIL:
            return {
                ...state,
                loading: false,
                error: "Error while fetching permissions"
            };
        default:
            return state;
    }
}

export function listPermissions(userID) {
    return {
        type: GET_PERMISSIONS,
        payload: {
            request: {
                method: 'post',
                url: "/privilage/get",
                data:{
                    token: "aaf6ce8673c0cab44406a215e1ac263a2ae4f5ab93a05d4b62dfe2c116456a81",
                    user_id: userID
                }
            }
        }
    };
}
