import React from "react";
import { axios, getCookie, updateCookie } from "../containers/Root.js";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { message, Popover} from "antd";
import { connect } from "react-redux";

import styles from "./Detail.scss";
@connect(state => {
    return {
        ...getCookie(),
    };
})
class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookInfo: {
                name: "bookinfo",
                auth: ["bookinfo1"],
                version: ["v1"],
                ISBN: "bookinfo1",
                publisher: "",
                language: ["chiness", ""],
                position: {
                    room: "",
                    shelf: "",
                },
                theme: [""],
                CLC: "",
                amount: "3",
                image: "",
                description: "this is descthis",
                copys: [{
                    uuid: "111111111",
                    status: "Available" //Available, Borrowed, Unavailable, Reserved
                }, {
                    uuid: "222222",
                    status: "Borrowed"
                }
                ],
            },
        };
        this.initCommand = this.initCommand.bind(this);
        this.handleApply = this.handleApply.bind(this);
        const { ISBN } = props.match.params;
    }
    handleApply(e) {
        const uuid = e.target.getAttribute("uuid");
        const { token, userType, userName } = this.props;
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
        axios.post(url, {
            uuids: [uuid],
        }, options)
            .then((response) => {
                if (response.data.type === "succeed") {
                    const { tokendate } = response.headers;
                    updateCookie(tokendate);
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
    initCommand() {
        if (Object.keys(this.state.bookInfo).length !== 0) {
            const { userType } = this.props;
            const { position, copys } = this.state.bookInfo;
            if (userType === "admin") {
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
                            {copys.map((copy, index) => {
                                return (
                                    <dd key={index}>
                                        <div>
                                            <span>{position.room + position.shelf}</span>
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
            else if (userType === "customer") {
                return (
                    <div className="apply">
                        <span>Apply</span>
                        <dl>
                            {copys.map((copy, index) => {
                                return (
                                    <dd key={index}>
                                        <div>
                                            <span>{position.room + position.shelf}</span>
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
            else {
                return <div></div>;
            }
        }
        else {
            return <div></div>;
        }
    }
    componentDidMount() {
        const { ISBN } = this.props.match.params;
        const { token, userType, userName } = this.props;
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
            .then((response) => {
                if (response.data.type === "succeed") {
                    if (token && token.length !== 0) {
                        const { tokendate } = response.headers;
                        updateCookie(tokendate);
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
    render() {
        const { bookInfo } = this.state;
        return (
            <div className={styles.detail}>
                <div className={styles.info}>
                    <img src={bookInfo.image} className={styles.image} />
                    <div className={styles.basicInfo}>
                        <hr className={styles.hr1}/>
                        <Popover content={bookInfo.name} placement="bottom">
                            <div className={styles.name}>{bookInfo.name}</div
                        ></Popover>
                        <hr className={styles.hr2}/>
                        <dd className={styles.auth}>
                            Author:
                            {bookInfo.auth.map((auther, index) => <dl key={index}><Link to={`/booksearchresult/authorName/${auther}`}>{auther},</Link></dl>)}
                        </dd>
                        <dd className={styles.version}>
                            Version:
                            {bookInfo.version.map((item, index) => <dl key={index}>{item},</dl>)}
                        </dd>
                        <p className={styles.isbn}>ISBN: {bookInfo.ISBN}</p>
                        <p className={styles.language}>Language: {bookInfo.language.join(", ")}</p>
                        <dd className={styles.theme}>
                            Genre:
                            {bookInfo.theme.map((theme, index) => <dl key={index}><Link to={`/booksearchresult/theme/${theme}`}>{theme},</Link></dl>)}
                        </dd>
                        <p>Position: {bookInfo.position.room}-{bookInfo.position.shelf}</p>
                        <div className={styles.amount}><span>{bookInfo.amount} </span><p>Book Left</p></div>
                        <hr className={styles.hr2}/>
                    </div>
                    <div className={styles.descriptionTitle}>Description</div>
                    <article className={styles.description}>{bookInfo.description}</article>
                </div>
                <div className={styles.command}>
                    <div>
                        <img src="/res/icon/bookCommandApplyTitle.png"/><span>{bookInfo.position.room}{bookInfo.position.shelf}</span>
                    </div>
                    <dd>
                        {bookInfo.copys.map((copy, index) => (
                            <dl key={copy.uuid}>
                                <div>{bookInfo.position.room}-{bookInfo.position.shelf}</div>
                                <span>{copy.status}</span>
                                <Popover content={copy.uuid} placement="top">
                                    <p>{copy.uuid}</p>
                                </Popover>
                                <button >Apply</button>
                            </dl>
                        ))};
                    </dd>
                </div>
            </div>
        );
    }
}
export default Detail;