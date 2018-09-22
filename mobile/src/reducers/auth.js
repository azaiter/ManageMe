const LOGIN = "redux-example/auth/LOGIN";
const LOGIN_SUCCESS = "redux-example/auth/LOGIN_SUCCESS";
const LOGIN_FAIL = "redux-example/auth/LOGIN_FAIL";
const LOGOUT = "redux-example/auth/LOGOUT";
const LOGOUT_SUCCESS = "redux-example/auth/LOGOUT_SUCCESS";
const LOGOUT_FAIL = "redux-example/auth/LOGOUT_FAIL";
const SIGNUP = "redux-example/auth/SIGNUP";
const SIGNUP_SUCCESS = "redux-example/auth/SIGNUP_SUCCESS";
const SIGNUP_FAIL = "redux-example/auth/SIGNUP_FAIL";

const initialState = {
    isLoggedIn: false,
    username: "",
    password: "",
    userAuthObj: {},
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                loggingIn: true
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggingIn: false,
                isLoggedIn: true,
                userAuthObj: action.payload.data
            };
        case LOGIN_FAIL:
            return {
                ...state,
                loggingIn: false,
                uasername: "",
                password: "",
                isLoggedIn: false,
                loginError: "Error while fetching logging in"
            };
        case LOGOUT:
            // return {
            //     ...state,
            //     loggingOut: true
            // };
            return {
                ...state,
                loggingOut: false,
                isLoggedIn: false,
                username: "",
                password: ""
            };
        // case LOGOUT_SUCCESS:
        //     return {
        //         ...state,
        //         loggingOut: false,
        //         isLoggedIn: false,
        //         username: "",
        //         password: ""
        //     };
        // case LOGOUT_FAIL:
        //     return {
        //         ...state,
        //         loggingOut: false,
        //         logoutError: "logging out failed"
        //     };
        case SIGNUP:
            return {
                ...state,
                loading: true
            };
        case SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                user: action.payload.data
            };
        case SIGNUP_FAIL:
            return {
                ...state,
                loading: false,
                loaded: false,
                error: action.error
            };
        default:
            return state;
    }
}

export function isLoaded(globalState) {
    return globalState.auth && globalState.auth.loaded;
}

export function login(username, password) {
    return {
        type: LOGIN,
        payload: {
            request: {
                method: "post",
                url: "/user/login",
                data:{
                    username,
                    password
                }
            }
        }
    };
}

export function logout() {
    return {
        type: LOGOUT
    };
}

export function signup() {
    return {
        type: SIGNUP,
        promise: (client) => client.get("/loadAuth")
    };
}
