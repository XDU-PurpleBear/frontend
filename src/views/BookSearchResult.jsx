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
            checkedLanguage : [],
            checkedRoom: [],
            checkedTheme: [],
        };
        this.handleCheck = this.handleCheck.bind(this);
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
    handleCheck(){
        let languageParent = this.languageParent;
        let themeParent = this.themeParent;
        let roomParent = this.roomParent;
        let languageCheckboxs = languageParent.querySelectorAll("input:checked");
        let roomCheckboxs = roomParent.querySelectorAll("input:checked");
        let themeCheckboxs = themeParent.querySelectorAll("input:checked");
        let checkedLanguage = [];
        let checkedRoom = [];
        let checkedTheme = [];

        for(let i=0;i<languageCheckboxs.length;i++){
            checkedLanguage.push(languageCheckboxs[i].value);
        }
        for(let j=0;j<roomCheckboxs.length;j++){
            checkedRoom.push(roomCheckboxs[j].value);
        }
        for(let k=0;k<themeCheckboxs.length;k++){
            checkedTheme.push(themeCheckboxs[k].value);
        }
        this.setState({
            checkedTheme: checkedTheme,
            checkedLanguage: checkedLanguage,
            checkedRoom: checkedRoom
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
        const {bookList,language,room,theme,checkedLanguage,checkedRoom,checkedTheme} = this.state;
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
                    if (bookList[j].position.room == room[i]){
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
        function subArray(arr1, arr2) {
            if(arr2.length === 0){
                return true;
            }
            return arr1.some(item1 => arr2.includes(item1))
        };



        return (
            <div className={styles.bookSearchResult}>
                <div className={styles.filter}>
                    <div className={styles.language}>
                        <div className={styles.title}>Language</div>
                        {/*command={this.handleFilter}*/}
                        <div className={styles.flow} ref={languageParent=>{this.languageParent=languageParent}}>
                        {language.map((item,index) => <FilterTags item={item} command={this.handleCheck} key={index} count={countl(bookList,language)[index]}/>)}
                        </div>
                        <hr className={styles.split}/>
                    </div>
                    <div className={styles.room}>
                        <div className={styles.title}>Floor</div>
                        <div className={styles.flow} ref={roomParent=>{this.roomParent=roomParent}}>
                        {room.map((item,index) => <FilterTags item={item} command={this.handleCheck} key={index} count={countr(bookList,room)[index]}/>)}
                        </div>
                        <hr className={styles.split}/>
                    </div>
                    <div className={styles.theme}>
                        <div className={styles.title}>Theme</div>
                        <div className={styles.flow} ref={themeParent=>{this.themeParent=themeParent}}>
                        {theme.map((item,index) => <FilterTags item={item} command={this.handleCheck} key={index} count={countt(bookList,theme)[index]}/>)}
                        </div>
                    </div>
                </div>
                <div className={styles.bookList}>
                    <span>{bookList.length} Results.</span>
                    <dl>
                        {bookList.filter(item => subArray(item.theme,checkedTheme) && subArray(item.language,checkedLanguage) && subArray([item.position.room],checkedRoom)).map((item, index) => <BookListItem item={item} key={index} />)}
                    </dl>
                </div>
            </div>
        );
    }
}

export default BookSearchResult;