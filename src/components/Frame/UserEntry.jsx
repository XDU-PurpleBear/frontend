import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch, Link} from "react-router-dom";
import {Menu, Dropdown, Icon} from "antd";
const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;

import styles from "./UserEntry.scss";
// import LogInOrSignUp from "../components/UserCenter/LogInOrSignUp.jsx";
// import UserInfo from "../components/UserCenter/UserInfo.jsx";

@connect(state => {
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
        this.handleHideLogInOrSignUp = this.handleHideLogInOrSignUp.bind(this);
        this.handleShowLogInOrSignUp = this.handleShowLogInOrSignUp.bind(this);
    }
    handleShowLogInOrSignUp(){
        this.setState({
            visibility: true,
        });
    }
    handleHideLogInOrSignUp(){
        this.setState({
            visibility: false,
        });
    }
    init(userType, userName){
        if(userType === "visitor"){
            return (
                <span onClick={this.handleShowLogInOrSignUp}>Sign in | Log in</span>
            );
        }
        let menu = null;
        if(userType === "customer"){
            menu = (
                <Menu>
                    <MenuItem key="/usercenter/info">
                        <Link to="/usercenter/info">
                            <span>UserInfo</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/BookApply">
                        <Link to="/usercenter/bookapply">
                            <span>BookApply</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/BookReturn">
                        <Link to="/usercenter/bookreturn">
                            <span>BookReturn</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/notify">
                        <Link to="/usercenter/notify">
                            <span>Notify</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem>
                        <span>Log Out</span>
                    </MenuItem>
                    <MenuDivider/>
                </Menu>
            );
        }
        if(userType === "admin"){
            menu = (
                <Menu>
                    <MenuItem key="/usercenter/info">
                        <Link to="/usercenter/info">
                            <span>UserInfo</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/BookApply">
                        <Link to="/usercenter/bookapply">
                            <span>BookApply</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/BookReturn">
                        <Link to="/usercenter/bookreturn">
                            <span>BookReturn</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/usercenter/notify">
                        <Link to="/usercenter/notify">
                            <span>Notify</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/management/add">
                        <Link to="/management/add">
                            <span>Add Book</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem key="/management/edit">
                        <Link to="/management/edit">
                            <span>Edit/Delete Book</span>
                        </Link>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem>
                        <span>Log Out</span>
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
    render(){
        const {dispatch, userType, userName}  = this.props;
        const {visibility} = this.state;
        return (
            <div className={styles.userEntry}>
                {
                    this.init(userType, userName)
                }
                <div className={styles.userSignIAndLogIn} style={{
                    display: (visibility? "flex" : "none"),
                }}>
                </div>
            </div>
        );
    }
}

export default UserEntry;