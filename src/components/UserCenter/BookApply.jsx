import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {axios, getCookie, updateCookie} from "../../containers/Root.js";
import Cookies from "js-cookie";
import {message} from "antd";

import styles from "./BookApply.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class BookApply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookList: []
        };
        this.references = {};
        this.handleBorrowSelected = this.handleBorrowSelected.bind(this);
    }

    handleBorrowSelected(){
        let checkboxs = this.references.dl.querySelectorAll("dt input[type=\"checkbox\"]");
        let checkeduuid = [];
        for(let i = 0; i < checkboxs.length; ++i){
            if(checkboxs[i].checked){
                checkeduuid.push(checkboxs[i].getAttribute("uuid"));
            }
        }
        if(checkeduuid.length === 0){
            message.error("Please select you want borrow!");
            return;
        }
        const {token, userType, userName} = this.props;
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        const url = "/api/user/borrow";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token
            },
        };
        axios.post(url,{
            uuids:checkeduuid,
        }, options)
        .then((response)=>{
            if (response.data.type === "succeed") {
                const {tokendate} = response.headers;
                updateCookie(tokendate);
                message.success("Borrow Book Success!.");
            }
            else if (response.data.type === "failed") {
                throw {
                    name: "BORROW_BOOK_ERROR",
                    message: response.data.errorReason
                };
            }
        })
        .catch((err) => {
            message.error("Borrow Book Error Because " + err.message);
        });
    }
    componentDidMount() {
        const { token, userType, userName } = this.props;
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        axios.get("/api/user/applylist", null, {
                responsetype: "json",
                headers: {
                    "token": token
                }
            }).then(response => {
                if (response.data.type === "succeed") {
                    const { tokendate } = response.headers;
                    updateCookie(tokendate);
                    this.setState({
                        bookList: response.data.data.bookList,
                    });
                    message.success("Get Apply Book List Success!");
                }
                else if (response.data.type === "failed") {
                    throw {
                        message: response.data.errorReason
                    };
                }
                else {
                    throw {
                        message: "Network Error",
                    };
                }
            }).catch(err => {
                message.error("Get Apply Book List Error because " + err.message);
            });
    }
    applyListItem(item, index) {
        return (
            <dt className={styles.applyListItem} key={index}>
                <img className={styles.image} src={item.image} />
                <Link className={styles.bookName} to={"/detail/" + item.ISBN}>
                    <span>{item.name}</span>
                </Link>
                <span className={styles.author} >
                    {item.auth.join()}
                </span>
                <span className={styles.position}>{item.position}</span>
                <span className={styles.number}>{item.amount} Books Left</span>
                <span className={styles.limite}>{item.timeLimits} weeks</span>
                <span className={styles.amount}>{item.amount}</span>
                <input className={styles.select} type="checkbox" uuid={item.uuid} />
            </dt>
        );
    }
    render() {
        return (
            <div className={styles.bookApply}>
                <div className={styles.applyList}>
                    <h2>My Apply List</h2>
                    <dl ref={dl=>this.references.dl=dl}>
                        {this.state.bookList.map((item, index)=>this.applyListItem(item, index))}
                    </dl>
                </div>
                <div className={styles.command}>
                    <button type="button" onClick={this.handleBorrowSelected}><span>Borrow Selected</span></button>
                </div>
            </div>
        );
    }
}

export default BookApply;