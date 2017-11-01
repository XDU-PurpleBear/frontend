import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {axios} from "../../containers/Root.js";
import Cookies from "js-cookie";
import {message} from "antd";

import styles from "./BookBorrow.scss";

@connect(state => {
    return {
        ...state.UserCenter.default,
    };
})
class BookBorrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookList: []
        };
    }

    componentDidMount() {
        const { token, userType, userName } = this.props;
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        axios.get("/api/user/borrowlist", null, {
                responsetype: "json",
                headers: {
                    "token": token
                }
            }).then(response => {
                if (response.data.type === "succeed") {
                    const { tokendate } = response.headers;
                    Cookies.set("token", token, {
                        expires: tokendate / 60 / 60 / 24,
                        path: "/",
                    });
                    Cookies.set("userType", userType, {
                        expires: tokendate / 60 / 60 / 24,
                        path: "/",
                    });
                    Cookies.set("userName", userName, {
                        expires: tokendate / 60 / 60 / 24,
                        path: "/",
                    });
                    this.setState({
                        bookList: response.data.data.bookList,
                    });
                    message.success("Get Borrow Book List Success!");
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
                message.error("Get Borrow Book List Error because " + err.message);
            });
    }
    borrowListItem(item, index) {
        return (
            <dt className={styles.borrowListItem} key={index}>
                <img className={styles.image} src={item.image} />
                <Link className={styles.bookName} to={"/detail/" + item.ISBN}>
                    <span>{item.name}</span>
                </Link>
                <span className={styles.author} >
                    {item.auth.join()}
                </span>
                <span className={styles.position}>{item.position}</span>
                <span className={styles.number}>{item.amount} Books Left</span>
                <span className={styles.timeLeft}>{item.timeLeft} weeks</span>
                <span className={styles.amount}>{item.amount}</span>
                
            </dt>
        );
    }
    render() {
        return (
            <div className={styles.bookBorrow}>
                <div className={styles.borrowList}>
                    <h2>My Borrow List</h2>
                    <dl>
                        {this.state.bookList.map((item, index)=>this.borrowListItem(item, index))}
                    </dl>
                </div>
                <div className={styles.command}></div>
            </div>
        );
    }
}

export default BookBorrow;