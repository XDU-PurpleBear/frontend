import {combineReducers} from "redux";
import {call, put, takeLatest} from "redux-saga/effects";
import {axios, removeCookie, updateCookie} from "../containers/Root.js";
import Cookies from "js-cookie";
import {message} from "antd";

const initialState = {
    userType: Cookies.get("userType") && Cookies.get("userType")!=="undefined"? Cookies.get("userType") : "visitor",
    userName: Cookies.get("userName") && Cookies.get("userName")!=="undefined"? Cookies.get("userName") : null,
    token: Cookies.get("token") && Cookies.get("token")!=="undefined"? Cookies.get("token") : null,
    userImage: Cookies.get("userImage") && Cookies.get("userImage")!=="undefined"? Cookies.get("userImage") : "",
    error: false,
    errorReason: "",
}

const USER_LOGIN = "USER_LOGIN";
const USER_LOGIN_SUCCEED = "USER_LOGIN_SUCCEED";
const USER_LOGIN_ERROR = "USER_LOGIN_ERROR";

const USER_LOGOUT = "USER_LOGOUT";
const USER_LOGOUT_SUCCEED = "USER_LOGOUT_SUCCESSD";
const USER_LOGOUT_ERROR = "USER_LOGOUT_ERROR";

const USER_SIGNUP = "USER_SIGNUP";
const USER_SIGNUP_SUCCEED = "USER_SIGNUP_SUCCEED";
const USER_SIGNUP_ERROR = "USER_SIGNUP_ERROR";

const USERINFO_CHANGE = "USERINFO_CHANGE";
const USERINFO_CHANGE_SECCEED = "USERINFO_CHANGE_SECCEED";
const USERINFO_CHANGE_ERROR = "USERINFO_CHANGE_ERROR";


function logIn({userKey, password, logInInfoType}) {
    return {
        type: USER_LOGIN,
        userKey,
        userType: logInInfoType,
        password,
    }
}
function* logInAjax(action){
    try{
        const {userKey, password, userType} = action;
        const url = "/api/login";

        const response = yield call(axios.post, url, null, {
            responsetype: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache, no-store",
                "userKey": userKey,
                "password": password,
                "userType": userType
            }
        });
        if(response.data.type === "succeed"){
            const {token, tokendate, usertype, username} = response.headers;
            const {image} = response.data.data;
            Cookies.set("token", token, {
                expires: tokendate/60/60/24,
                path: "/",
            });
            Cookies.set("userType", usertype, {
                expires: tokendate/60/60/24,
                path: "/",
            });
            Cookies.set("userName", username, {
                expires: tokendate/60/60/24,
                path: "/",
            });
            Cookies.set("userImage", image, {
                expires: tokendate/60/60/24,
                path: "/",
            });
            yield put({
                type: USER_LOGIN_SUCCEED,
                userName: username,
                userType: usertype,
                token: token,
                userImage: image,
            });
        }
        else if(response.data.type === "failed"){
            throw {
                name: USER_LOGIN_ERROR,
                message: response.data.errorReason,
            };
        }
        else{
            throw {
                name: USER_LOGIN_ERROR,
                message: "Network Error",
            };
        }
    }
    catch(error){
        yield put({
            type: USER_LOGIN_ERROR,
            errorReason: error.message,
        });
    }
    
}
function* logInSaga(){
    yield takeLatest(USER_LOGIN, logInAjax);
}


function logOut(history) {
    return {
        type: USER_LOGOUT,
        history: history,
    }
}
function* logOutAjax(action){
    try{
        const {history} = action;
        const token = Cookies.get("token");
        const url = "/api/logout";
        
        const response = yield call(axios.post, url, null, {
            responsetype: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache, no-store",
                "token": token,
            }
        });
        if(response.data.type === "succeed"){
            removeCookie();
            yield put({
                type: USER_LOGOUT_SUCCEED,
                history: history,
            });
        }
        else if(response.data.type === "failed"){
            throw {
                name: USER_LOGOUT_ERROR,
                message: response.data.errorReason,
            };
        }
        else{
            throw {
                name: USER_LOGOUT_ERROR,
                message: "Network Error",
            };
        }
    }
    catch(error){
        yield put({
            type: USER_LOGOUT_ERROR,
            errorReason: error.message,
        });
    }
    
}
function* logOutSaga(){
    yield takeLatest(USER_LOGOUT, logOutAjax);
}

function signUp({userName, password, tel, telPrefix}) {
    return {
        type: USER_SIGNUP,
        userName,
        password,
        tel,
    }
}
function* signUpAjax(action){
    try{
        const {userName, password, tel} = action;
        const url = "/api/signup";
        
        const response = yield call(axios.post, url, null, {
            responsetype: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cache-Control": "no-cache, no-store",
                "userName": userName,
                "password": password,
                "tel": tel
            }
        });
        if(response.data.type === "succeed"){
            // const {token, tokendate, usertype, username} = response.headers;
            // Cookies.set("token", token, {
            //     expires: tokendate/60/60/24,
            //     path: "/",
            // });
            // Cookies.set("userType", usertype, {
            //     expires: tokendate/60/60/24,
            //     path: "/",
            // });
            // Cookies.set("userName", username, {
            //     expires: tokendate/60/60/24,
            //     path: "/",
            // });
            yield put({
                type: USER_SIGNUP_SUCCEED,
                // userName: username,
                // userType: usertype,
                // token: token,
            });
        }
        else if(response.data.type === "failed"){            
            throw {
                name: USER_SIGNUP_ERROR,
                message: response.data.errorReason,
            };
        }
        else{
            throw {
                name: USER_SIGNUP_ERROR,
                message: "Network Error",
            };
        }
    }
    catch(error){
        yield put({
            type: USER_SIGNUP_ERROR,
            errorReason: error.message,
        });
    }
}

function* signUpSaga(){
    yield takeLatest(USER_SIGNUP, signUpAjax);
}

function userCenterReducer(state = initialState, action) {
    switch (action.type) {
        case USER_LOGIN_SUCCEED: {
            message.success("Login Succeed.");
            return {
                error: false,
                errorReason: null,
                token: action.token,
                userType: action.userType,
                userName: action.userName,
                userImage: action.userImage,
            };
        } break;
        case USER_LOGIN_ERROR: {
            message.error("Login Error Because " + action.errorReason);
            return {
                error: true,
                errorReason: action.errorReason,
                token: null,
                userType: "visitor",
                userName: null,
                userImage: "",
            };
        } break;
        case USER_LOGOUT_SUCCEED: {
            const {history} = action;
            history.push("/");
            // message.success("Logout Succeed.");
            
            return {
                error: false,
                errorReason: "",
                token: null,
                userType: "visitor",
                userName: null,
                userImage: "",
            };
        } break;
        case USER_LOGOUT_ERROR: {
            message.error("Logout Error Because " + action.errorReason);
            return {
                ...state,
                error: true,
                errorReason: action.errorReason,
            };
        } break;
        case USER_SIGNUP_SUCCEED: {
            message.success("SignUp Succeed.");
            return {
                ...state,
                error: false,
                errorReason: null,
            };
        } break;
        case USER_SIGNUP_ERROR: {
            message.error("SignUp Error Because " + action.errorReason);            
            return {
                ...state,
                error: true,
                errorReason: action.errorReason,
            };
        } break;
        default:{
            return state;
        } break;
    }
}

export const userCenterActions = {
    logIn: logIn,
    logOut: logOut,
    signUp: signUp
};

export const userCenterSagas = {
    logInSaga,
    logOutSaga,
    signUpSaga,
};

export default combineReducers({
    default: userCenterReducer,
});