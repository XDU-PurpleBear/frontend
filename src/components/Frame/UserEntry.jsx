import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch, Link} from "react-router-dom";
import {Menu, Dropdown, Icon} from "antd";
const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;

import styles from "./UserEntry.scss";
import LogInOrSignUp from "../UserCenter/LogInOrSignUp.jsx";

import {userCenterActions} from "../../views/UserCenterRedux.js";

import userIcon from "../../res/icon/user.png";

@connect(state => {
    console.log(state);
    return {
        ...(state.UserCenter.default),
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
        const {dispatch} = this.props;
        dispatch(userCenterActions.logOut());
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
                    {/* <MenuItem key="/usercenter/info" disabled>
                        <Link to="/usercenter/info">
                            <span>UserInfo</span>
                        </Link>
                    </MenuItem> */}
                    <MenuDivider/>
                    <MenuItem key="/usercenter/bookapply">
                        <Link to="/usercenter/bookapply">
                            <span>BookApply</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/bookreturn">
                        <Link to="/usercenter/bookreturn">
                            <span>BookReturn</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>                    
                    <MenuItem key="/usercenter/BookBorrow">
                        <Link to="/usercenter/bookborrow">
                            <span>BookBorrow</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    {/* <MenuItem key="/usercenter/notify" disabled>
                        <Link to="/usercenter/notify">
                            <span>Notify</span>
                        </Link>
                    </MenuItem> */}
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
                    {/* <MenuItem key="/usercenter/info" disabled>
                        <Link to="/usercenter/info">
                            <span>UserInfo</span>
                        </Link>
                    </MenuItem> */}
                    <MenuDivider/>
                    <MenuItem key="/usercenter/bookapply">
                        <Link to="/usercenter/bookapply">
                            <span>BookApply</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/bookreturn">
                        <Link to="/usercenter/bookreturn">
                            <span>BookReturn</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>                    
                    <MenuItem key="/usercenter/bookborrow">
                        <Link to="/usercenter/bookborrow">
                            <span>BookBorrow</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    {/* <MenuItem key="/usercenter/notify" disabled>
                        <Link to="/usercenter/notify">
                            <span>Notify</span>
                        </Link>
                    </MenuItem> */}
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
        console.log(nextProps);
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
            backgroundImage: userImage === "" ? `url(${userIcon})` : `url(${userImage})`,
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