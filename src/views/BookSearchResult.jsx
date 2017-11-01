import * as React from "react";
import * as PropTypes from "prop-types";
import { message } from "antd";
import { connect } from "react-redux";
import {axios} from "../containers/Root.js";
import Cookies from "js-cookie";

import BookListItem from "../components/BookSearch/BookListItem.jsx";

import styles from "./BookSearchResult.scss";

@connect(state => {
    return {
        ...state.UserCenter.default,
    };
})
class BookSearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: null,
            searchValue: null,
            bookList: [],
        };
    }
    componentDidUpdate(){
        const { searchType, searchValue } = this.props.match.params;
        const _searchType = this.state.searchType;
        const _searchValue = this.state.searchValue;
        if(searchType === _searchType && searchValue === _searchValue){
            return;
        }
        const {token, userType, userName} = this.props;                
        const url = `/api/book/query?${searchType}=${searchValue}`;
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store"
            },
        };
        if (token && token.length !== 0) {
            options.headers.token = token;
        }
        axios.get(url, options)
            .then((response)=>{
                if (response.data.type === "succeed") {
                    if (token && token.length !== 0) {
                        const {tokendate} = response.headers;
                        Cookies.set("token", token, {
                            expires: tokendate/60/60/24,
                            path: "/",
                        });
                        Cookies.set("userType", userType, {
                            expires: tokendate/60/60/24,
                            path: "/",
                        });
                        Cookies.set("userName", userName, {
                            expires: tokendate/60/60/24,
                            path: "/",
                        });
                    }
                    this.setState({
                        searchType: searchType,
                        searchValue: searchValue,
                        bookList: response.data.data.bookList,
                    })
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "BOOKLIST_LOAD_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                message.error("Load BookList Error Because" + err.message);
            });
    }

    componentDidMount() {
        const { searchType, searchValue } = this.props.match.params;
        const {token, userType, userName} = this.props;                
        const url = `/api/book/query?${searchType}=${searchValue}`;
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store"
            },
        };
        if (token && token.length !== 0) {
            options.headers.token = token;
        }
        axios.get(url, options)
            .then((response)=>{
                if (response.data.type === "succeed") {
                    if (token && token.length !== 0) {
                        const {tokendate} = response.headers;
                        Cookies.set("token", token, {
                            expires: tokendate/60/60/24,
                            path: "/",
                        });
                        Cookies.set("userType", userType, {
                            expires: tokendate/60/60/24,
                            path: "/",
                        });
                        Cookies.set("userName", userName, {
                            expires: tokendate/60/60/24,
                            path: "/",
                        });
                    }
                    this.setState({
                        searchType: searchType,
                        searchValue: searchValue,
                        bookList: response.data.data.bookList,
                    })
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "BOOKLIST_LOAD_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                message.error("Load BookList Error Because" + err.message);
            });
    }
    render() {
        console.log("ender");
        const {bookList} = this.state;
        return (
            <div className={styles.bookSearchResult}>
                <div className={styles.filter}></div>
                <div className={styles.bookList}>
                    <span>{bookList.length} Results.</span>
                    <dl>
                        {bookList.map((item, index) => <BookListItem item={item} key={index} />)}
                    </dl>
                </div>
            </div>
        );
    }
}

export default BookSearchResult;