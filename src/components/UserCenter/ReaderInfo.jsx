import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {axios, getCookie, updateCookie} from "../../containers/Root.js";
import {message} from "antd";

import styles from "./ReaderInfo.scss";


@connect(state => {
    return {
        ...getCookie(),
    };
})
class ReaderInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userInfo: {},
            overdueList: [],
        };
        this.references = {};
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            message.error("Please select Image!");
            return;
        }
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        let data = new FormData();
        data.append("name", "userName");
        data.append("image", this.references.selectImage.files[0]);
        axios.post("/api/user/editimage",data,{
            headers:{
                token: token,
            }
        }).then(response => {
            console.log(response);
        }).catch(e => {
            console.log(e);
        });
        // let reader = new FileReader();
        // reader.readAsBinaryString(this.references.selectImage.files[0]);
        // reader.onerror = e => {
        //     message.error("Upload Error because: " + e.message);
        // }
        // reader.onload = e => {
        //     const image = e.target.result;
        //     axios.post("/api/user/editimage", {
        //         image:{
        //             data: image
        //         }
        //     }, {
        //         responsetype: "json",
        //         headers: {
        //             "token": token 
        //         }
        //     }).then(response=>{
        //         if(response.data.type === "succeed"){
        //             const {tokendate} = response.headers;
        //             updateCookie(tokendate);
        //             message.success("Modify Icon Success!");
        //         }
        //         else if(response.data.type === "failed"){
        //             throw {
        //                 message: response.data.errorReason
        //             };
        //         }
        //         else{
        //             throw {
        //                 message: "Network Error",
        //             };
        //         }
        //     }).catch(err=>{
        //         message.error("Modify Icon Error because " + err.message);
        //     });
        // };
    }

    componentDidMount() {
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
                    message.success("Get user Info Success!");
                    axios
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
                message.error("Get user Info Error because " + err.message);
            });
    }

    overdueListItem(item, index) {
        return (
            <dt className={styles.overdueListItem} key={index}>
                <img className={styles.image} src={ReaderIcon} />
                <Link className={styles.bookName} to={"/detail/" + item.ISBN}>
                    <div>{item.name}</div>
                </Link>
                <div className={styles.ISBN}>ISBN: {item.ISBN}</div>
                <div className={styles.position}>{item.position}</div>
                <div className={styles.amount}>{item.amount} Books Left</div>
                <div className={styles.time}>{item.time} days</div>
                <div className={styles.fineMoney}>{item.fine}</div>
            </dt>
        );
    }

    render(){
        // if(!this.state.userInfo.uuid){
        //     return <div></div>;
        // }

        const btn= {
            marginTop: "2vh",
            border: "1px solid #888888",
            marginLeft: "auto",
            marginRight: "auto",
            width: "15vh",
            height: "4vh",
            lineHeight: "4vh",
            backgroundColor: "white",
        };

        const userinfoStyle = {
            lineHeight: "9vh",
            fontSize: "1.2rem",
        };

        return (
            <div className={styles.main}>
                <div className={styles.img}>
                    <div className={styles.readerIcon}>
                        <img className={styles.readerImage} ref={image => this.references.image = image} />
                    </div>
                    <div className={styles.button} >
                        <input type="button" value="Select Image" style={btn}/>
                        <input type="file" name="pic" accept="image/*" className={styles.file} onChange={this.handleSelectImage} ref={selectImage => this.references.selectImage = selectImage} />
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

                <div className={styles.overdue}>
                    <div className={styles.dueTip}><h3>Overdue Order Remain: &nbsp;&nbsp;<a href="#">{this.state.userInfo.orderNumber}</a></h3></div>
                    <div className={styles.prop}>
                        <div className={styles.empty}></div>
                        <div className={styles.duration}><h3>Duration</h3></div>
                        <div className={styles.fine}><h3>Fine</h3></div>
                    </div>
                    <div className={styles.overdueList}>
                        <dl>
                        {this.state.overdueList.map((item, index)=>this.overdueListItem(item, index))}
                        </dl>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReaderInfo;