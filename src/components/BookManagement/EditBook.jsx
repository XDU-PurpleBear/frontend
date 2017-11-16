import * as React from "react";
import { notification } from "antd";
import { axios, getCookie, updateCookie } from "../../containers/Root.js";
import { connect } from "react-redux";

import AddBookPreview from "./AddBookPreview.jsx";
import styles from "./EditBook.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class EditBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookInfo: {
                name: "",
                auth: [],
                version: [],
                ISBN: "",
                publisher: "",
                language: [],
                position: {
                    room: "",
                    shelf: "",
                },
                theme: [],
                CLC: "",
                amount: "",
                image: "",
                description: "",
                copys: [],
            },
        };
        this.handleAddCopy = this.handleAddCopy.bind(this);
        this.handleDeleteCopy = this.handleDeleteCopy.bind(this);
        this.handleEditCopy = this.handleEditCopy.bind(this);
    }
    handleAddCopy(){
        const { token } = this.props;
        if (!token || token === "") {
            notification.info({
                message: "Please Log In.",
                duration: 2,
            })
            this.props.history.push("/");
            return;
        }
        let {bookInfo} = this.state;
        const url = "/api/book/addcopy";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        axios.post(url, {
            ISBN: bookInfo.ISBN,
        }, options)
            .then((response)=>{
                console.log(response);
                if (response.data.type === "succeed") {
                    const {tokendate} = response.headers;
                    updateCookie(tokendate);
                    notification.success({
                        message: "Add Book Copy Success!.",
                        duration: 2
                    });
                    bookInfo.copys.push({
                        uuid: response.data.data.uuid,
                        status: "Available"
                    });
                    bookInfo.amount = parseInt(bookInfo.amount) + 1;
                    this.setState({
                        bookInfo: bookInfo
                    });
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "ADD_BOOKCOPY_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                notification.warn({
                    message: "Add Book Copy Error Because " + err.message,
                    duration: 2
                });
            });
    }
    handleDeleteCopy(e){
        const { token } = this.props;
        const uuid = e.target.getAttribute("uuid");
        if (!token || token === "") {
            notification.info({
                message: "Please Log In.",
                duration: 2,
            })
            this.props.history.push("/");
            return;
        }
        let {bookInfo} = this.state;
        const url = "/api/book/deletecopy";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        axios.post(url, {
            uuid: uuid,
        }, options)
            .then((response)=>{
                console.log(response);
                if (response.data.type === "succeed") {
                    const {tokendate} = response.headers;
                    updateCookie(tokendate);
                    notification.success({
                        message: "Delete Book Copy Success!.",
                        duration: 2
                    });
                    bookInfo.copys = bookInfo.copys.filter(copy => copy.uuid!==uuid);
                    bookInfo.amount = parseInt(bookInfo.amount) - 1;
                    this.setState({
                        bookInfo: bookInfo
                    });
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "DELETE_BOOKCOPY_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                notification.warn({
                    message: "Delete Book Copy Error Because " + err.message,
                    duration: 2
                });
            });
    }
    handleEditCopy(e){
        const { token } = this.props;
        const uuid = e.target.getAttribute("uuid");
        const status = e.target.value;
        const target = e.target;
        if (!token || token === "") {
            notification.info({
                message: "Please Log In.",
                duration: 2,
            })
            this.props.history.push("/");
            return;
        }
        let {bookInfo} = this.state;
        const url = "/api/book/editcopy";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        axios.post(url, {
            uuid: uuid,
            status: status,
        }, options)
            .then((response)=>{
                if (response.data.type === "succeed") {
                    const {tokendate} = response.headers;
                    updateCookie(tokendate);
                    notification.success({
                        message: "Change Book Copy Status Success!.",
                        duration: 2
                    });
                    for(let i = 0; i < bookInfo.copys.length; ++i){
                        if(bookInfo.copys[i].uuid === uuid){
                            bookInfo.copys[i].status = status;
                            break;
                        }
                    }
                    this.setState({
                        bookInfo: bookInfo
                    });
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "CHANGE_BOOKCOPYSTATUS_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                notification.warn({
                    message: "Change Book Copy Status Error Because " + err.message,
                    duration: 2
                });
                target.value = this.state.bookInfo.copys.filter(copy => copy.uuid === uuid)[0].status;
            });
    }
    createSelect(copy){
        return (
            <select uuid={copy.uuid} onChange={this.handleEditCopy} defaultValue={copy.status}>
                {
                    ["Available", "Unavailable", "Borrowed", "Reserved"].map(item => {
                        return <option value={item} key={item}>{item}</option>;
                    })
                }
            </select>
        );
    }
    componentDidMount(){
        const { token } = this.props;
        if (!token || token === "") {
            notification.info({
                message: "Please Log In.",
                duration: 2,
            })
            this.props.history.push("/");
            return;
        }
        const { ISBN } = this.props.match.params;
        const url = "/api/book/info?ISBN=" + ISBN;
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        axios.get(url, options)
            .then((response)=>{
                if (response.data.type === "succeed") {
                    const {tokendate} = response.headers;
                    updateCookie(tokendate);
                    notification.success({
                        message: "Load Book Info Success!.",
                        duration: 2
                    });
                    this.setState({
                        bookInfo: response.data.data.bookInfo
                    });
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "LOAD_BOOKINFO_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                notification.warn({
                    message: "Load Book Info Error Because " + err.message,
                    duration: 2
                });
            });
    }
    render() {
        const {bookInfo} = this.state;
        return (
            <div className={styles.editBook} >
                <div className={styles.imageSelectArea}>
                    <img src={bookInfo.image}/>
                </div>
                <div className={styles.description}>
                    <span>Description</span>
                    <article>{bookInfo.description}</article>
                </div>
                <div className={styles.basicInfoArea}>
                    <span>Basic Info</span>
                    <div>
                        <div>
                            <label htmlFor="ISBN">ISBN:</label><input disabled type="text" id="ISBN" value={bookInfo.ISBN} />
                        </div>
                        <div>
                            <label htmlFor="name">Name:</label><input disabled type="text" id="name" value={bookInfo.name}/>
                        </div>
                        <div>
                            <label htmlFor="author">Author:</label><input disabled type="text" id="author" value={bookInfo.auth.join(",")}/>
                        </div>
                        <div>
                            <label htmlFor="version">Version:</label><input disabled type="text" id="version" value={bookInfo.version.join(",")}/>
                        </div>
                        <div>
                            <label htmlFor="publisher">Publisher:</label><input disabled type="text" id="publisher" value={bookInfo.publisher} />
                        </div>
                        <div>
                            <label htmlFor="CLC">CLC:</label><input disabled type="text" id="CLC" value={bookInfo.CLC}/>
                        </div>
                        <div>
                            <label htmlFor="amount">Amount:</label><input disabled type="text" id="amount" value={bookInfo.amount}/>
                        </div>

                    </div>
                </div>
                <div className={styles.tag}>
                    <span>Tag</span>
                    <div>
                        <div>
                            <label htmlFor="language">Language:</label><input disabled type="text" id="language" value={bookInfo.language.join(",")} />
                        </div>
                        <div>
                            <label htmlFor="Genre">Genre:</label><input disabled type="text" id="Genre" value={bookInfo.theme.join(",")}/>
                        </div>
                        <div>
                            <label htmlFor="Position">Position:</label><input disabled type="text" id="Position" value={bookInfo.position.room + "-" + bookInfo.position.shelf} />
                        </div>
                    </div>
                </div>
                <div className={styles.copyCtrl}>
                    <div>
                        <img src={require("../../res/icon/bookCommandApplyTitle.png")}/><span>{bookInfo.position.room + "-" + bookInfo.position.shelf}</span>
                    </div>
                    <dd>
                        {bookInfo.copys.map((copy, index) => (
                            <dl key={copy.uuid}>
                                <div>{bookInfo.position.room + "-" + bookInfo.position.shelf}</div>
                                {this.createSelect(copy)}
                                <p>{copy.uuid}</p>
                                <button type="button" onClick={this.handleDeleteCopy} uuid={copy.uuid}>——</button>
                            </dl>
                        ))}
                    </dd>
                    <button type="button" onClick={this.handleAddCopy}><div>+</div></button>
                </div>
            </div>
        );
    }
}

export default EditBook;