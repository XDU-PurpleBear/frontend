import React from "react";
import {Route, Switch, Link, Redirect} from "react-router-dom";
import {Layout, Menu, Icon} from "antd";
import {connect} from "react-redux";
const { Header, Sider, Content } = Layout;

import styles from "./Frame.scss";

import {getCookie} from "../containers/Root.js";

import SearchForm from "../components/Frame/SearchForm.jsx";
import UserEntry from "../components/Frame/UserEntry.jsx";

import ReaderInfo from "../components/UserCenter/ReaderInfo.jsx";

import Main from "../views/Main.jsx";
import BookSearchReault from "../views/BookSearchResult.jsx";
import Detail from "../views/Detail.jsx";
import AddBook from "../components/BookManagement/AddBook.jsx";
import EditBook from "../components/BookManagement/EditBook.jsx";

import UserOrderList from "../components/UserCenter/OrderList.jsx";

import CreateReader from "../components/AdminCenter/CreateReader.jsx";
import EditReader from "../components/AdminCenter/EditReader.jsx";
import OrderManagement from "../components/AdminCenter/OrderManagement.jsx";

import NotFound from "../views/NotFound.jsx";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class Frame extends React.Component {
    constructor(props) {
        super(props);
        this.handleToMain = this.handleToMain.bind(this);
    }
    handleToMain(){
        this.props.history.push("/");
    }
    render() {
        const {history, userType} = this.props;
        return (
            <div className={styles.frame}>
                <Layout className={styles.navLayout}>
                    <Header className={styles.navHeader}>
                        <span className={styles.title} onClick={this.handleToMain}>XDU Library</span>
                        <SearchForm history={history} />
                        <UserEntry history={history} className={styles.UserEntry}/>
                    </Header>
                    <Content className={styles.navContent}>
                        <Switch>
                            <Route exact path="/" component={Main}/>
                            <Route exact path="/booksearchresult/:searchType/:searchValue" component={BookSearchReault}/>
                            <Route exact path="/detail/:ISBN" component={Detail}/>

                            <Route exact path="/bookmanagement/add" component={AddBook} render={() => userType==="visitor"?<Redirect to="/"/>:<AddBook />}/>
                            <Route exact path="/bookmanagement/edit/:ISBN" component={EditBook}/>

                            <Route path="/usercenter/info" component={ReaderInfo}/>
                            <Route path="/usercenter/orderlist" component={UserOrderList}/>

                            <Route path="/admincenter/createreader" component={CreateReader}/>
                            <Route path="/admincenter/editreader" component={EditReader}/>
                            <Route path="/admincenter/ordermanagement" component={OrderManagement}/>

                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default Frame;