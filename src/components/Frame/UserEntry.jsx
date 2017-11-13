import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch, Link} from "react-router-dom";
import {Menu, Dropdown, Icon} from "antd";
const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;

import styles from "./UserEntry.scss";

import {getCookie} from "../../containers/Root.js";

import LogInOrSignUp from "../UserCenter/LogInOrSignUp.jsx";

import {userCenterActions} from "../../views/UserCenterRedux.js";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class UserEntry extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visibility: false,            
        }
        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }
    handleShow(){
        this.setState({
            visibility: true,
        });
    }
    handleHide(){
        this.setState({
            visibility: false,
        });
    }
    handleLogOut(){
        const {dispatch, history} = this.props;
        dispatch(userCenterActions.logOut(history));
    }
    init(userType, userName){
        if(userType === "visitor"){
            return (
                <span onClick={this.handleShow}>Log in</span>
            );
        }
        let menu = null;
        if(userType === "customer"){
            menu = (
                <Menu>
                    <MenuItem key="/usercenter/info" >
                        <Link to="/usercenter/info">
                            <span>UserInfo</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/orderlist">
                        <Link to="/usercenter/orderlist">
                            <span>Order Page</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>                    
                    <MenuItem>
                        <span onClick={this.handleLogOut}>Log Out</span>
                    </MenuItem>
                    <MenuDivider/>
                </Menu>
            );
        }
        if(userType === "admin"){
            menu = (
                <Menu>
                    <MenuDivider/>
                    <MenuItem key="/admincenter/ordermanagement">
                        <Link to="/admincenter/ordermanagement">
                            <span>Order Management</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/admincenter/createreader">
                        <Link to="/admincenter/createreader">
                            <span>Create Reader</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/admincenter/editreader">
                        <Link to="/admincenter/editreader">
                            <span>Edit Reader</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/bookmanagement/add">
                        <Link to="/bookmanagement/add">
                            <span>Add Book</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem>
                        <span onClick={this.handleLogOut}>Log Out</span>
                    </MenuItem>
                    <MenuDivider/>
                </Menu>
            );
        }
        return (
            <Dropdown overlay={menu}>
                <span>{userName} <Icon type="down" /></span>
            </Dropdown>
        );
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.userName !== null && this.props.userName === null){
            this.setState({
                visibility: false,
            });
            return;
        }
        if(nextProps.userName === null && this.props.userName !== null){
            this.setState({
                visibility: false,
            });
            return;
        }
    }
    render(){
        const {dispatch, userType, userName, userImage}  = this.props;
        let {visibility} = this.state;
        
        const userSignIAndLogInStyle = {
            display: visibility? "flex" : "none",
        }
        const userImageStyle = {
            backgroundImage: userImage === "" ? "url(\"/res/icon/user.png\")" : `url(${userImage})`,
            display: userType === "visitor" ? "none" : "inline-block"
        };
        return (
            <div className={styles.userEntry}>
                {
                    this.init(userType, userName)
                }
                <div className={styles.userImage} style={userImageStyle}></div>
                <div className={styles.userSignIAndLogIn} style={userSignIAndLogInStyle}>
                    <LogInOrSignUp dispatch={dispatch}/>
                    <Icon className={styles.closeButton} type="close" onClick={this.handleHide}/>
                </div>
            </div>
        );
    }
}

export default UserEntry;