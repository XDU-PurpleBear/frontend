import {combineReducers} from "redux";
import {call, put, takeLatest} from "redux-saga/effects";
import axios from "axios";
import Cookies from "js-cookie";
import {message} from "antd";

const initialState = {
    userKey: "UserCenter",
    userType: Cookies.get("userType") && Cookies.get("userType")!=="undefined"? Cookies.get("userType") : "visitor",
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


function logIn({userKey, password}) {
    return {
        type: USER_LOGIN,
        userKey,
        password,
    }
}
function* logInAjax(action){
    try{
        const {userKey, password} = action;
        const url = "/api/login";

        const response = yield call(axios.post, url, null, {
            responsetype: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",                
                "userKey": userKey,
                "password": password,
            }
        });
        if(response.data.type === "succeed"){
            const {token, tokendate, usertype} = response.headers;
            Cookies.set("token", token, {
                expires: tokendate/60/60/24,
                path: "/",
            });
            Cookies.set("userType", usertype, {
                expires: tokendate/60/60/24,
                path: "/",
            });
            yield put({
                type: USER_LOGIN_SUCCEED,
                userKey: userKey,
                userType: usertype
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


function logOut() {
    return {
        type: USER_LOGOUT,
    }
}
function* logOutAjax(){
    try{
        const token = Cookies.get("token");
        const url = "/api/logout";
        
        const response = yield call(axios.post, url, null, {
            responsetype: "json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",                
                "token": token,
            }
        });
        if(response.data.type === "succeed"){
            Cookies.remove("token", {
                path: "/",
            })
            Cookies.remove("userType", {
                path: "/",
            })
            yield put({
                type: USER_LOGOUT_SUCCEED,
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
        tel: telPrefix+tel,
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
                "userName": userName,
                "password": password,
                "tel": tel
            }
        });
        if(response.data.type === "succeed"){
            yield put({
                type: USER_SIGNUP_SUCCEED,
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
                userKey: action.userKey,
                userType: action.userType
            };
        } break;
        case USER_LOGIN_ERROR: {
            message.error("Login Error Because " + action.errorReason);
            return {
                ...initialState,
                error: true,
                errorReason: action.errorReason,
            };
        } break;
        case USER_LOGOUT_SUCCEED: {
            message.success("Logout Succeed.");
            
            return {
                ...initialState,
                userType: "visitor"
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
                ...initialState,
            };
        } break;
        case USER_SIGNUP_ERROR: {
            message.error("SignUp Error Because " + action.errorReason);            
            return {
                ...initialState,
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