import React from "react";
import {axios} from "../containers/Root.js";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import {message} from "antd";
import {connect} from "react-redux";

import styles from "./Detail.scss";
@connect(state => {
    return {
        ...state.UserCenter.default,
    };
})
class Detail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bookInfo: {
                name: "",
                auth: [],
                version: [],
                ISBN: "",
                language: "",
                position: "",
                amount: "",
                image: "",
                description: "",
                copys: [],
            },
        };
        this.initCommand = this.initCommand.bind(this);
        this.handleApply = this.handleApply.bind(this);
    }
    handleApply(e){
        const uuid = e.target.getAttribute("uuid");
        const {token, userType, userName} = this.props; 
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }               
        const url = "/api/user/apply";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token
            },
        };
        axios.post(url,{
            uuids:[uuid],
        }, options)
        .then((response)=>{
            if (response.data.type === "succeed") {
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
                message.success("Apply Book Success!.");
            }
            else if (response.data.type === "failed") {
                throw {
                    name: "Apply_BOOK_ERROR",
                    message: response.data.errorReason
                };
            }
        })
        .catch((err) => {
            message.error("Apply Book Error Because " + err.message);
        });
    }
    initCommand(){
        if(Object.keys(this.state.bookInfo).length !== 0){
            const {userType} = this.props;
            const {position, copys} = this.state.bookInfo;
            if(userType === "admin"){
                return (
                    <div>
                        <button>
                            <Link to={{
                                pathname: "/bookmanagement/edit",
                                state: {
                                    bookInfo: this.state.bookInfo,
                                }
                            }}><span>Edit</span></Link>
                        </button>
                        <span>Apply</span>
                        <dl>
                            {copys.map((copy, index)=>{
                                return (
                                    <dd key={index}>
                                        <div>
                                            <span>{position}</span>
                                            <button type="button" uuid={copy.uuid} onClick={this.handleApply}>Apply</button>
                                            <div></div>
                                        </div>
                                    </dd>
                                );
                            })}
                        </dl>
                    </div>
                );
            }
            else if(userType === "customer"){
                return (
                    <div className="apply">
                        <span>Apply</span>
                        <dl>
                            {copys.map((copy, index)=>{
                                return (
                                    <dd key={index}>
                                        <div>
                                            <span>{position}</span>
                                            <button type="button" uuid={copy.uuid} onClick={this.handleApply}>Apply</button>
                                            <div></div>
                                        </div>
                                    </dd>
                                );
                            })}
                        </dl>
                    </div>
                );
            }
            else{
                return <div></div>;
            }
        }
        else{
            return <div></div>;
        }
    }
    componentDidMount() {
        const { ISBN } = this.props.match.params;
        const {token, userType, userName} = this.props; 
        const url = `/api/book/info?ISBN=${ISBN}`;
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
                        bookInfo: response.data.data.bookInfo,
                    });
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "LOADBOOKINFO_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch(function (err) {
                message.error("Load BookInfo Error Because" + err.message);
            });
    }
    render(){
        const {bookInfo} = this.state;
        return (
            <div className={styles.detail}>
                <div className={styles.info}>
                    <img src={bookInfo.image} className={styles.image}/>
                    <span className={styles.name}>{bookInfo.name}</span>
                    <ul className={styles.author}>
                        {bookInfo.auth.map((author, index) => {
                            return <li key={index}>
                                <Link to={`/booksearchresult/authorName/${author}`}><span>{author}</span></Link>
                            </li>
                        })}
                    </ul>
                    <span className={styles.version}>{bookInfo.version}</span>
                    <span className={styles.isbn}>{bookInfo.ISBN}</span>
                    <span className={styles.language}>Language: {bookInfo.language}</span>
                    <span className={styles.position}>{bookInfo.position}</span>
                    <span className={styles.number}>{bookInfo.amount} Books Left</span>
                    <div className={styles.description}>Description</div>
                    <article className={styles.descriptionInfo}>{bookInfo.description}</article>
                </div>
                <div className={styles.command}>
                    {this.initCommand()}
                </div>
            </div>
        );
    }
}
export default Detail;