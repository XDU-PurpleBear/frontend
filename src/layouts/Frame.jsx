import React from "react";
import {Route, Switch, Link} from "react-router-dom";
import {Layout, Menu, Icon} from "antd";
import {connect} from "react-redux";
const { Header, Sider, Content } = Layout;

import styles from "./Frame.scss";

// import BookSearchResult from "../views/BookSearchResult.jsx";
import SearchForm from "../components/Frame/SearchForm.jsx";
import UserEntry from "../components/Frame/UserEntry.jsx";
// import UserCenter from "../views/UserCenter.jsx";
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
                    <Header className={styles.navHeader}>
                        <span className={styles.title} onClick={this.toggle}>XDU Library</span>
                        <SearchForm />
                        <UserEntry />
                    </Header>
                    <Content className={styles.navContent}>
                        <Switch>
                            <Route exact path="/" component={Main}/>
                            {/* <Route path="/booksearchreault" component={BookSearchReault}/> */}
                            {/* <Route path="/usercenter" component={UserCenter}/> */}
                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default Frame;