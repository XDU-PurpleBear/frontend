import * as React from "react";
import {connect} from "react-redux";
import sha256 from "sha256";
import {axios, getCookie, updateCookie} from "../../containers/Root.js";
import {notification} from "antd";

import styles from "./CreateReader.scss";

import backgroundImage from "../../res/image/adminBack.jpg";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class CreateReader extends React.Component {
    constructor(props) {
        super(props);
        this.references = {};

        this.state = {
            allCheckResult: false,
        }

        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.handleCheckUserName = this.handleCheckUserName.bind(this);
        this.handleCheckStudentID = this.handleCheckStudentID.bind(this);
        this.handleCheckTel = this.handleCheckTel.bind(this);
        this.handleCheckBalance = this.handleCheckBalance.bind(this);
        this.handleCheckPassword = this.handleCheckPassword.bind(this);
        this.handleCheckConfirm = this.handleCheckConfirm.bind(this);

        this.handleBlurUserName = this.handleBlurUserName.bind(this);
        this.handleBlurStudentID = this.handleBlurStudentID.bind(this);
        this.handleBlurTel = this.handleBlurTel.bind(this);
        this.handleBlurBalance = this.handleBlurBalance.bind(this);
        this.handleBlurPassword = this.handleBlurPassword.bind(this);
        this.handleBlurConfirm = this.handleBlurConfirm.bind(this);
        this.handleUpdateRegister = this.handleUpdateRegister.bind(this);

        this.allChecks = [
            this.handleCheckUserName,
            this.handleCheckStudentID,
            this.handleCheckTel,
            this.handleCheckBalance,
            this.handleCheckPassword,
            this.handleCheckConfirm,
        ];
    }

    handleSignUp(){
        const {token} = this.props;
        const url = "/api/signup";
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache,no-store",
            username: this.references.userName.value,
            studentid: this.references.studentID.value,
            balance: this.references.balance.value,
            deposit: 300,
            password: sha256(this.references.password.value),
            tel: this.references.tel.value,
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
                    message: "Create Account Success!",
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
                message: "Create Account Failed Because " + err.message,
                duration: 2
            });
        });
    }
    handleCancel(){
        this.props.history.goBack();
    }
    handleUpdateRegister() {
        let allCheckResult = this.references.policy.checked && this.allChecks.map(check => check()).every(checkResult => checkResult.status);
        this.setState({
            allCheckResult,
        });
    }
    handleCheckUserName() {
        let userName = this.references.userName.value;
        return {
            userName,
            status: userName.trim().length !== 0,
        };
    }
    handleCheckStudentID() {
        let studentID = this.references.studentID.value;
        return {
            studentID,
            status: /^[0-9]{11}$/.test(studentID),
        };
    }
    handleCheckTel() {
        let tel = this.references.tel.value;
        return {
            tel,
            status: /^1[0-9]{10}$/.test(tel),
        };
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
            status: /^.{6,16}$/.test(password) && password === confirm,
        };
    }
    handleCheckConfirm() {
        return this.handleCheckPassword();
    }

    handleBlurUserName() {
        this.references.userNameAlert.innerText = (this.handleCheckUserName().status ? "" : "Please input name!");
        this.handleUpdateRegister();
    }
    handleBlurStudentID() {
        this.references.studentIDAlert.innerText = this.handleCheckStudentID().status ? "" : "The StudentID is number and length is 11!";
        this.handleUpdateRegister();
    }
    handleBlurTel() {
        this.references.telAlert.innerText = this.handleCheckTel().status ? "" : "The Telphone is number and length is 11!";
        this.handleUpdateRegister();
    }
    handleBlurBalance() {
        this.references.balanceAlert.innerText = this.handleCheckBalance().status ? "" : "The Balance is number and more than 0!";
        this.handleUpdateRegister();
    }
    handleBlurPassword() {
        this.references.passwordAlert.innerText = this.handleCheckPassword().status ? "" : "The password's length is more than 6 and less than 16!";
        this.references.confirmAlert.innerText = this.handleCheckConfirm().status ? "" : "The confirm must same to password!";
        this.handleUpdateRegister();
    }
    handleBlurConfirm() {
        this.handleBlurPassword();
        this.handleUpdateRegister();
    }
    render() {
        const {allCheckResult} = this.state;
        return (
            <div className={styles.createReader}>
                <img className={styles.image} src="/res/icon/user.png" />
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
                    <div className={styles.inputContent}><label htmlFor="name">UserName:</label> <input type="text" id="name" ref={userName => { this.references.userName = userName; }} onBlur={this.handleBlurUserName} /></div>
                    <span ref={userNameAlert => { this.references.userNameAlert = userNameAlert; }} className={styles.inputAlert}></span>
                </div>
                <div className={styles.studentID}>
                    <div className={styles.inputContent}><label htmlFor="id">StudentID:</label> <input type="text" id="id" ref={studentID => { this.references.studentID = studentID; }} onBlur={this.handleBlurStudentID} /></div>
                    <span ref={studentIDAlert => { this.references.studentIDAlert = studentIDAlert; }} className={styles.inputAlert}></span>
                </div>
                <div className={styles.tel}>
                    <div className={styles.inputContent}><label htmlFor="tel">Telphone:</label> <input type="text" id="tel" ref={tel => { this.references.tel = tel; }} onBlur={this.handleBlurTel} /></div>
                    <span ref={telAlert => { this.references.telAlert = telAlert; }} className={styles.inputAlert}></span>
                </div>
                <div className={styles.cash}>
                    <label htmlFor="cash">Pledge Cash:</label> <input type="text" id="cash" value="300" disabled />
                </div>
                <div className={styles.balance}>
                    <label htmlFor="balance">Balance:</label> <input type="text" id="balance" ref={balance => { this.references.balance = balance; }} onBlur={this.handleBlurBalance} />
                    <span ref={balanceAlert => { this.references.balanceAlert = balanceAlert; }}></span>
                </div>
                <div className={styles.policy}>
                    <input type="checkbox" id="policy" onChange={this.handleUpdateRegister} ref={policy => { this.references.policy = policy; }} /><label htmlFor="balance">I agree to all items for usage and private policy.</label>
                </div>
                <div className={styles.cancel}>
                    <button type="button" onClick={this.handleCancel}>Cancel</button>
                </div>
                <div className={styles.register}>
                    { allCheckResult ? <button type="button" ref={register => { this.references.register = register; }} onClick={this.handleSignUp}>Register</button> : <button type="button" disabled ref={register => { this.references.register = register; }}>Register</button>}
                </div>
            </div>
        );
    }
}

export default CreateReader;