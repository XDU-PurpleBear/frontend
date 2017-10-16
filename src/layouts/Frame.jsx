import React from "react";
import {Route, Switch, Link} from "react-router-dom";
import {Layout, Menu, Icon} from "antd";
import {connect} from "react-redux";
const { Header, Sider, Content } = Layout;

import styles from "./Frame.scss";

import BookSearch from "../views/BookSearch.jsx";
import UserCenter from "../views/UserCenter.jsx";
import Main from "../views/Main.jsx";
import Detail from "../views/Detail.jsx";
import NotFound from "../views/NotFound.jsx";

@connect(state => {
    return {
        ...(state.UserCenter.default.userType),
    };
})
class Frame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        }
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        const defaultSelectedKeys = [this.props.location.pathname];
        const iconStyle = {
            fontSize:"x-large",
            width: "100%",
            height: "100%",
            color: "white",
            marginTop: "5px",
        };
        return (
            <div className={styles.frame}>
                <Layout className={styles.navLayout}>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                        <div theme="dark" className={styles.navLayoutToggle} onClick={this.toggle}>
                            <Icon style={iconStyle} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}  />
                        </div>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={defaultSelectedKeys}>
                            <Menu.Item key="/booksearch">
                                <Link to="/booksearch">
                                    <Icon type="search" />
                                    <span>Search Book</span>
                                </Link>                                                                    
                            </Menu.Item>
                            <Menu.Item key="/usercenter">
                                <Link to="/usercenter">
                                    <Icon type="user" />
                                    <span>User Center</span>
                                </Link>                                
                            </Menu.Item>

                        </Menu>
                    </Sider>
                    <Layout>
                        <Content className={styles.navContent}>
                            <Switch>
                                <Route exact path="/" component={Main}/>
                                <Route path="/booksearch" component={BookSearch}/>
                                <Route path="/usercenter" component={UserCenter}/>
                                <Route component={NotFound} />
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default Frame;