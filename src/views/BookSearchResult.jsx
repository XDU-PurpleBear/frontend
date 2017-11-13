import * as React from "react";
import * as PropTypes from "prop-types";
import { message } from "antd";
import { connect } from "react-redux";
import {axios, getCookie, updateCookie} from "../containers/Root.js";
import Cookies from "js-cookie";

import BookListItem from "../components/BookSearch/BookListItem.jsx";
import FilterTags from "../components/BookSearch/FilterTags";

import styles from "./BookSearchResult.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class BookSearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: null,
            searchValue: null,
            bookList: [],
            language: [],
            room: [],
            theme: [],
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
                        updateCookie(tokendate);
                    }
                    this.setState({
                        searchType: searchType,
                        searchValue: searchValue,
                        bookList: response.data.data.bookList,
                        language: response.data.data.filter.language,
                        room: response.data.data.filter.room,
                        theme: response.data.data.filter.theme,
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
                        updateCookie(tokendate);
                    }
                    this.setState({
                        searchType: searchType,
                        searchValue: searchValue,
                        bookList: response.data.data.bookList,
                        language: response.data.data.filter.language,
                        room: response.data.data.filter.room,
                        theme: response.data.data.filter.theme,
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
        const {bookList,language,room,theme} = this.state;
        if(language.length > 3)
            language.length =3;
        if(room.length > 3)
            room.length =3;
        if(theme.length > 3)
            theme.length =3;
        let countl = function (bookList,language) {
            let count = [];
            for(let i=0;i<language.length;i++){
                count[i]=0;
                for (let j=0;j <bookList.length;j++){
                        if (bookList[j].language == language[i]){
                            count[i]+=1;
                        }
                }
            }
            return count;
        };
        let countr = function (bookList,room) {
            let count = [];
            for(let i=0;i<room.length;i++){
                count[i]=0;
                for (let j=0;j <bookList.length;j++){
                    if (bookList[j].room == room[i]){
                        count[i]+=1;
                    }
                }
            }
            return count;
        };
        let countt = function (bookList,theme) {
            let count = [];
            for(let i=0;i<theme.length;i++){
                count[i]=0;
                for (let j=0;j <bookList.length;j++){
                    if (bookList[j].theme == theme[i]){
                        count[i]+=1;
                    }
                }
            }
            return count;
        };
        return (
            <div className={styles.bookSearchResult}>
                <div className={styles.filter}>
                    <div className={styles.language}>
                        <div className={styles.title}>Language</div>
                        {language.map((item,index) => <FilterTags item={item} key={index} count={countl(bookList,language)[index]}/>)}
                    </div>
                    <div className={styles.room}>
                        <div className={styles.title}>Floor</div>
                        {room.map((item,index) => <FilterTags item={item} key={index} count={countr(bookList,room)[index]}/>)}
                    </div>
                    <div className={styles.theme}>
                        <div className={styles.title}>Theme</div>
                        {theme.map((item,index) => <FilterTags item={item} key={index} count={countt(bookList,theme)[index]}/>)}
                    </div>
                </div>
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