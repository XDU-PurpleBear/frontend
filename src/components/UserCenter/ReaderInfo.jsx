import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {axios, getCookie, updateCookie} from "../../containers/Root.js";
import {message, notification} from "antd";
import RecommendItem from "../../components/Main/RecommendItem.jsx";

import styles from "./ReaderInfo.scss";

import ReaderIcon from "../../res/icon/user.png";

@connect(state => {
    return {
        ...state.UserCenter.default,
    };
})

class ReaderInfo extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userInfo: [],
            overdueList: [],
            bookList: [],
        };
        this.references = {};
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getRecommend = this.getRecommend.bind(this);
        this.getOverdueList = this.getOverdueList.bind(this);
    }

    handleSelectImage() {
        if (this.references.selectImage.files.length === 0) {
            this.references.image.src= "";
            return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(this.references.selectImage.files[0]);
        reader.onload = e => {
            this.references.image.src = e.target.result;
        };
    }
    handleSubmit(e) {
        e.preventDefault();
        const {token, userType, userName} = this.props;
        if(this.references.selectImage.files.length === 0){
            notification.error("Please select Image!");
            return;
        }
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        const url = "/api/user/editimage";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        let data = new FormData();
        data.append("image", this.references.selectImage.files[0])
        axios.post(url, data,options)
            .then((response)=>{
                if (response.data.type === "succeed") {
                    const {tokendate} = response.headers;
                    updateCookie(tokendate);
                    notification.success({
                        message: "Edit Image Success!.",
                        duration: 2
                    });
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "GET_BOOKPREVIEWINFO_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                notification.error({
                    message: "Edit Image Error Because " + err.message,
                    duration: 2
                });
            });
    }

    getOverdueList(){
        const {token, userType, userName} = this.props;
        const url = "/api/user/overduelist";
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
                        overdueList: response.data.data.orderList,
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
                notification.error({
                    message: "Load OverdueList Error because" + err.message,
                    duration: 2,
                });
            });
    }

    getRecommend(){
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
                notification.error({
                    message: "Get Recommend Error because" + err.message,
                    duration: 2,
                });
            });
    }

    componentDidMount() {
        this.getRecommend();
        this.getOverdueList();
        this.references.image.src = "../../res/icon/user.png";
        const { token, userType, userName } = this.props;
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        axios.get("/api/user/info", null, {
                responsetype: "json",
                headers: {
                    "token": token
                }
            }).then(response => {
                if (response.data.type === "succeed") {
                    const { tokendate } = response.headers;
                    updateCookie(tokendate);
                    this.setState({
                        userInfo: response.data.data.userInfo,
                    });
                    notification.success({
                        message: "Get user Info Success",
                        duration: 2,
                    });
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
               notification.error({
                   message: "Get user Info Error because" + err.message,
                   duration: 2,
               });
            });
    }

    overdueListItem(item, index) {
        return (
            <dt className={styles.overdueListItem} key={index}>
                <img className={styles.image} src={ReaderIcon} />
                <div className={styles.bookNamePart}>
                    <Link to={"/detail/" + item.ISBN}>
                        <span className={styles.bookName}>{item.bookName}</span>
                    </Link>
                    <div className={styles.emptyPart}>
                    </div>
                </div>
                <div className={styles.ISBN}>ISBN: {item.ISBN}</div>
                <div className={styles.position}>{item.position.room + item.position.shelf}</div>
                <div className={styles.amount}>{item.amount} Books Left</div>
                <div className={styles.time}>{item.overDays} days</div>
                <div className={styles.fineMoney}>{item.fine}</div>
            </dt>
        );
    }

    render(){

        const {bookList} = this.state;

        const btn= {
            marginTop: "2vh",
            border: "1px solid #888888",
            marginLeft: "auto",
            marginRight: "auto",
            width: "15vh",
            height: "4vh",
            lineHeight: "4vh",
            backgroundColor: "white",
            fontSize: "0.7rem",
        };

        const userinfoStyle = {
            lineHeight: "9vh",
            fontSize: "0.8rem",
        };

        const aStyle = {
            textDecoration: "none",
            color: "red",
        };

        const h3Style = {
            fontSize: "0.8rem",
        };

        return (
            <div className={styles.main}>
                <div className={styles.left}>
                <div className={styles.img}>
                    <div className={styles.readerIcon}>
                        <img className={styles.readerImage} ref={image => this.references.image = image} />
                    </div>
                    <div className={styles.button} >
                        <input type="button" value="Select Image" style={btn}/>
                        {/*<label htmlFor="file" className={styles.select}>Select Image</label>*/}
                        <input type="file" name="pic" accept="image/*" className={styles.file} onChange={this.handleSelectImage} ref={selectImage => this.references.selectImage = selectImage} />
                        {/*<input type="file" name="pic" accept="image/*" className="file"*/}
                               {/*onChange={this.handleSelectImage}*/}
                               {/*ref={selectImage => this.references.selectImage = selectImage} />*/}
                        <input type="submit" value="Upload" style={btn}
                               onClick={this.handleSubmit}/>
                    </div>
                </div>

                <div className={styles.info}>
                    <span className={styles.userName} style={userinfoStyle}>User Name:</span>
                    <span className={styles.nameValue} style={userinfoStyle}>{this.state.userInfo.userName}</span>
                    <span className={styles.studentID} style={userinfoStyle}>Student ID:</span>
                    <span className={styles.IDValue} style={userinfoStyle}>{this.state.userInfo.studentID}</span>
                    <span className={styles.telphone} style={userinfoStyle}>Telphone:</span>
                    <span className={styles.telValue} style={userinfoStyle}>{this.state.userInfo.tel}</span>
                    <span className={styles.balance} style={userinfoStyle}>Balance:</span>
                    <span className={styles.balanceValue} style={userinfoStyle}>{this.state.userInfo.balance}</span>
                </div>
                {/*<div className={styles.table}>*/}
                    {/*<table>*/}
                        {/*<tr>*/}
                            {/*<td>User Name:</td> <td className="name">{userinfo.username}</td>*/}
                        {/*</tr>*/}
                        {/*<tr>*/}
                            {/*<td>Student ID:</td> <td>{userinfo.studentID}</td>*/}
                        {/*</tr>*/}
                        {/*<tr>*/}
                            {/*<td>Telphone:</td> <td>Telphone:</td>*/}
                        {/*</tr>*/}
                        {/*<tr>*/}
                            {/*<td>Balance:</td> <td>{userinfo.balance}</td>*/}
                        {/*</tr>*/}
                    {/*</table>*/}
                {/*</div>*/}

                <div className={styles.overdue}>
                    <div className={styles.dueTip}><h3 style={h3Style}>Overdue Order Remain: &nbsp;&nbsp;<a href="/usercenter/orderlist" style={aStyle}>{this.state.userInfo.orderNumber}</a></h3></div>
                    <div className={styles.prop}>
                        <div className={styles.empty}></div>
                        <div className={styles.duration}><h3 style={h3Style}>Duration</h3></div>
                        <div className={styles.fine}><h3 style={h3Style}>Fine</h3></div>
                    </div>
                    <div className={styles.overdueList}>
                        <dl>
                        {this.state.overdueList.map((item, index)=>this.overdueListItem(item, index))}
                        </dl>
                    </div>
                </div>
                </div>
                <div className={styles.right}>
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
            </div>
        );
    }
}

export default ReaderInfo;