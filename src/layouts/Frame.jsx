import React from "react";
import {Route, Switch, Link} from "react-router-dom";
import {Layout, Menu, Icon} from "antd";
import {connect} from "react-redux";
const { Header, Sider, Content } = Layout;

import styles from "./Frame.scss";

import SearchForm from "../components/Frame/SearchForm.jsx";
import UserEntry from "../components/Frame/UserEntry.jsx";
// import UserCenter from "../views/UserCenter.jsx";
import Main from "../views/Main.jsx";
import BookSearchReault from "../views/BookSearchResult.jsx";
import Detail from "../views/Detail.jsx";
import AddBook from "../components/BookManagement/AddBook.jsx";
import EditBook from "../components/BookManagement/EditBook.jsx";
import BookApply from "../components/UserCenter/BookApply.jsx";
import BookBorrow from "../components/UserCenter/BookBorrow.jsx";
import BookReturn from "../components/UserCenter/BookReturn.jsx";
import AdminInfo from "../components/UserCenter/AdminInfo.jsx";
import ReaderInfo from "../components/UserCenter/ReaderInfo.jsx";

import NotFound from "../views/NotFound.jsx";

@connect(state => {
    return {
        userType: state.UserCenter.default.userType,
    };
})
class Frame extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {history} = this.props;
        return (
            <div className={styles.frame}>
                <Layout className={styles.navLayout}>
                    <Header className={styles.navHeader}>
                        <span className={styles.title}>XDU Library</span>
                        <SearchForm history={history} />
                        <UserEntry className={styles.UserEntry}/>
                    </Header>
                    <Content className={styles.navContent}>
                        <Switch>
                            <Route exact path="/" component={Main}/>
                            <Route exact path="/booksearchresult/:searchType/:searchValue" component={BookSearchReault}/>
                            <Route exact path="/detail/:ISBN" component={Detail}/>

                            <Route exact path="/bookmanagement/add" component={AddBook}/>
                            <Route exact path="/bookmanagement/edit" component={EditBook}/>

                            <Route path="/usercenter/admininfo" component={AdminInfo}/> 
                            <Route path="/usercenter/readerinfo" component={ReaderInfo}/>

                            <Route path="/usercenter/bookapply" component={BookApply}/>
                            <Route path="/usercenter/bookreturn" component={BookReturn}/>
                            <Route path="/usercenter/bookborrow" component={BookBorrow}/>

                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default Frame;