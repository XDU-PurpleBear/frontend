import * as React from "react";
import {Route, Link} from "react-router-dom";
import {axios, getCookie, updateCookie} from "../containers/Root.js";
import {connect} from "react-redux";
import {notification} from "antd";

import RecommendItem from "../components/Main/RecommendItem.jsx";
import styles from "./Main.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bookList: [],
        };
    }
    componentDidMount(){
        const {token, userType, userName} = this.props;
        const url = "/api/book/recommend";
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
                        updateCookie(token, userName, userType, tokendate);
                    }
                    this.setState({
                        bookList: response.data.data.bookList,
                    })
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "RECOMMENT_LOAD_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                notification.warn({
                    message: "Load Recommend Error Because" + err.message,
                    duration: 2
                });
            });
    }
    render(){
        const {bookList} = this.state;
        return (
            <div className={styles.main}>
                <div className={styles.recommend}>
                    <div className={styles.recommendTitle}>
                        <span>Recommend</span>
                    </div>
                    <dl className={styles.recommendContent}>
                        {bookList.map((book, index) => <RecommendItem key={index} bookInfo={book} />)}
                    </dl>
                </div>
                <div className={styles.recommendBack}></div>
            </div>
        );
    }
}

export default Main;