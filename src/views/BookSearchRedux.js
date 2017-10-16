import {combineReducers} from "redux";
import {call, put, takeLatest} from "redux-saga/effects";
import axios from "axios";
import Cookies from "js-cookie";
import {message} from "antd";

const initialState = {
    searchType: "bookname",
    searchValue: "",
    loading: false,
    loaded: false,
    error: false,
    errorReason: "",
    bookList: [],
}

const BOOKLIST_LOAD = "BOOKLIST_LOAD";
const BOOKLIST_LOAD_PENDING = "BOOKLIST_LOAD_PENDING";
const BOOKLIST_LOAD_SUCCEED = "BOOKLIST_LOAD_SUCCEED";
const BOOKLIST_LOAD_ERROR = "BOOKLIST_LOAD_ERROR";

function loadBookList(searchType, searchValue) {
    return {
        type: BOOKLIST_LOAD,
        searchType,
        searchValue,
    }
}
function* loadBookListAjax(action){
    yield put({
        type: BOOKLIST_LOAD_PENDING,
    });

    try{
        const {searchType, searchValue} = action;
        // const url = `/api/book/query?${searchType}=${searchValue}`;
        const url = `http://localhost:8085/api/book/query?${searchType}=${searchValue}`;
        let options = {
            responsetype: "json",
            headers: {},
        };
        const token = Cookies.get("token");
        if(token && token.length !== 0){
            options.headers.token = token;
        }
        const response = yield call(axios.get, url, options);
        if(response.data.type === "succeed"){
            if(token && token.length !== 0){
                const newTokenDate = response.headers.tokenDate;
                Cookies.set("token", token, {
                    expires: newTokenDate/60/60/24,
                    path: "/",
                })
            }
            yield put({
                type: BOOKLIST_LOAD_SUCCEED,
                bookList: response.data.data.bookList,
            });
        }
        else if(response.data.type === "failed"){
            throw {
                name: "BOOKLIST_LOAD_ERROR",
                message: response.data.errorReason
            };
        }
    }
    catch(error){
        yield put({
            type: BOOKLIST_LOAD_ERROR,
            errorReason: error.message,
        });
    }
    
}
function* loadBookListSaga(){
    yield takeLatest(BOOKLIST_LOAD, loadBookListAjax);
}

function bookSearchReducer(state = initialState, action) {
    switch (action.type) {
        case BOOKLIST_LOAD: {
            return {
                ...state,
                loading: false,
                error: false,
                loaded: false,
                searchType: action.searchType,
                searchValue: action.searchValue,
            };
        } break;
        case BOOKLIST_LOAD_PENDING: {
            message.loading("Loading BookList.");
            return {
                ...state,
                loading: true,
                error: false,
                loaded: false,
            };
        } break;
        case BOOKLIST_LOAD_SUCCEED: {
            message.success("Load BookList Succeed.");
            return {
                ...state,
                loading: false,
                error: false,
                loaded: true,
                bookList: action.bookList,                
            };
        } break;
        case BOOKLIST_LOAD_ERROR: {
            message.error("Load BookList Error Because" + action.errorReason);
            return {
                ...state,
                loading: false,
                error: false,
                loaded: false,
                errorReason: action.errorReason,
            };
        } break;
        default:{
            return state;
        } break;
    }
}



export const bookSearchActions = {
    loadBookList: loadBookList,
};

export const bookSearchSagas = {
    loadBookListSaga,
};

export default combineReducers({
    default: bookSearchReducer,
});