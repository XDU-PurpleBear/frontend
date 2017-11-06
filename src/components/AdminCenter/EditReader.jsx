import * as React from "react";
import {connect} from "react-redux";
import sha256 from "sha256";
import {axios, getCookie, updateCookie} from "../../containers/Root.js";
import {notification} from "antd";

import styles from "./EditReader.scss";

import searchImage from "../../res/icon/search.png";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class EditReader extends React.Component {
    constructor(props) {
        super(props);
        this.references = {};

        this.state = {
            allCheckResult: false,
            userInfo: null,
        }

        this.handleEditReader = this.handleEditReader.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleGetReaderInfo = this.handleGetReaderInfo.bind(this);

        this.handleCheckBalance = this.handleCheckBalance.bind(this);
        this.handleCheckPassword = this.handleCheckPassword.bind(this);
        this.handleCheckConfirm = this.handleCheckConfirm.bind(this);

        this.handleBlurBalance = this.handleBlurBalance.bind(this);
        this.handleBlurPassword = this.handleBlurPassword.bind(this);
        this.handleBlurConfirm = this.handleBlurConfirm.bind(this);

        this.allChecks = [
            this.handleCheckBalance,
            this.handleCheckPassword,
            this.handleCheckConfirm,
        ];

        this.showEditPanel = this.showEditPanel.bind(this);
        this.showSearchPanel = this.showSearchPanel.bind(this);
    }

    handleEditReader(){
        const {uuid} = this.state.userInfo;
        const {token} = this.props;
        let password = this.references.password.value;
        if(password !== ""){
            password = sha256(password);
        }
        const url = "/api/user/editinfo";
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache,no-store",
            balance: this.references.balance.value,
            password: password,
            uuid: uuid,
            token: token
        };
        axios.post(url, null, {
            responsetype: "json",
            headers: headers
        })
        .then(response => {
            if(response.data.type === "succeed"){
                const {tokendate} = response.headers;
                updateCookie(tokendate)
                notification.success({
                    message: "Edit Account Success!",
                    duration: 2
                });
                this.props.history.go(0);
            }
            else if(response.data.type === "failed"){
                throw {
                    message: response.data.errorReason
                };
            }
            else{
                throw {
                    message: "Network Error",
                };
            }
        })
        .catch(err => {
            notification.error({
                message: "Edit Account Failed Because " + err.message,
                duration: 2
            });
        });
    }
    handleCancel(){
        this.props.history.goBack();
    }

    handleGetReaderInfo(){
        const studentID = this.references.searchId.value;
        if(studentID.length !== 11){
            notification.warn({
                message: "Please Input StudentID, it's lenght is 11!",
                duration: 2,
            });
            return;
        }
        const {token} = this.props;
        const url = "/api/user/searchinfo";
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache,no-store",
            studentID: studentID,
            token: token
        };
        axios.get(url, {
            responsetype: "json",
            headers: headers
        })
        .then(response => {
            if(response.data.type === "succeed"){
                const {tokendate} = response.headers;
                updateCookie(tokendate)
                notification.success({
                    message: "Load Reader Info Success!",
                    duration: 2
                });
                this.setState({
                    userInfo: response.data.data.userInfo
                });
            }
            else if(response.data.type === "failed"){
                throw {
                    message: response.data.errorReason
                };
            }
            else{
                throw {
                    message: "Network Error",
                };
            }
        })
        .catch(err => {
            notification.error({
                message: "Load Reader Info Failed Because " + err.message,
                duration: 2
            });
        });
    }
    handleUpdateEdit() {
        let allCheckResult = this.allChecks.map(check => check()).every(checkResult => checkResult.status);
        this.setState({
            allCheckResult,
        });
    }
    handleCheckBalance() {
        let balance = this.references.balance.value;
        return {
            balance,
            status: /^[0-9]+$/.test(balance),
        };
    }
    handleCheckPassword() {
        let password = this.references.password.value;
        let confirm = this.references.confirm.value;
        return {
            password,
            status: (password === "" && confirm === "" )|| /^.{6,16}$/.test(password) && password === confirm,
        };
    }
    handleCheckConfirm() {
        return this.handleCheckPassword();
    }

    handleBlurBalance() {
        this.references.balanceAlert.innerText = this.handleCheckBalance().status ? "" : "The Balance is number and more than 0!";
        this.handleUpdateEdit();
    }
    handleBlurPassword() {
        this.references.passwordAlert.innerText = this.handleCheckPassword().status ? "" : "The password's length is more than 6 and less than 16!";
        this.references.confirmAlert.innerText = this.handleCheckConfirm().status ? "" : "The confirm must same to password!";
        this.handleUpdateEdit();
    }
    handleBlurConfirm() {
        this.handleBlurPassword();
        this.handleUpdateEdit();
    }

    showEditPanel(){
        const {allCheckResult, userInfo} = this.state;
        return (
            <div className={styles.editReader}>
                <img className={styles.image} src={userInfo.image} />
                <div className={styles.title}><div>Create Account</div></div>

                <div className={styles.password}>
                    <label htmlFor="password">Password:</label> <input type="password" id="password" ref={password => { this.references.password = password; }} onBlur={this.handleBlurPassword} />
                    <span ref={passwordAlert => { this.references.passwordAlert = passwordAlert; }}></span>
                </div>
                <div className={styles.confirm}>
                    <label htmlFor="confirm">Confirm Password:</label> <input type="password" id="confirm" ref={confirm => { this.references.confirm = confirm; }} onBlur={this.handleBlurConfirm} />
                    <span ref={confirmAlert => { this.references.confirmAlert = confirmAlert; }}></span>
                </div>

                <div className={styles.userName}>
                    <div className={styles.inputContent}><label htmlFor="name">UserName:</label> <input disabled type="text" id="name" value={userInfo.userName}/></div>
                </div>
                <div className={styles.studentID}>
                    <div className={styles.inputContent}><label htmlFor="id">StudentID:</label> <input disabled type="text" id="id" value={userInfo.studentID} /></div>
                </div>
                <div className={styles.tel}>
                    <div className={styles.inputContent}><label htmlFor="tel">Telphone:</label> <input disabled type="text" id="tel" value={userInfo.tel}/></div>
                </div>
                <div className={styles.cash}>
                    <label htmlFor="cash">Pledge Cash:</label> <input type="text" id="cash" value="300" disabled />
                </div>
                <div className={styles.balance}>
                    <label htmlFor="balance">Balance:</label> <input type="text" id="balance" defaultValue={userInfo.balance} ref={balance => { this.references.balance = balance; }} onBlur={this.handleBlurBalance} />
                    <span ref={balanceAlert => { this.references.balanceAlert = balanceAlert; }}></span>
                </div>
                <div className={styles.cancel}>
                    <button type="button" onClick={this.handleCancel}>Cancel</button>
                </div>
                <div className={styles.register}>
                    { allCheckResult ? <button type="button" ref={edit => { this.references.edit = edit; }} onClick={this.handleEditReader}>Edit</button> : <button type="button" disabled ref={edit => { this.references.edit = edit; }}>Edit</button>}
                </div>
            </div>
        );
    }
    showSearchPanel(){
        return (
            <div className={styles.search}>
                <div>
                    <input ref={searchId => {this.references.searchId=searchId;}} type="text" id="searchID" onKeyDown={e => {if(e.key === "Enter"){this.handleGetReaderInfo()}}}/><img src={searchImage} onClick={this.handleGetReaderInfo} />
                </div>
            </div>
        );
    }
    render(){
        return this.state.userInfo === null ? this.showSearchPanel() : this.showEditPanel();
    }
}

export default EditReader;