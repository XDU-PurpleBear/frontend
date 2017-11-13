import * as React from "react";
import { notification, Tabs } from "antd";
import { axios, getCookie, updateCookie } from "../../containers/Root.js";
import { connect } from "react-redux";

const TabPane = Tabs.TabPane;

import ApplyingItem from "../Order/ApplyingItem.jsx";
import BorrowingItem from "../Order/BorrowingItem.jsx";
import FinishedItem from "../Order/FinishedItem.jsx";
import InvalidItem from "../Order/InvalidItem.jsx";
import OverdueItem from "../Order/OverdueItem.jsx";

import styles from "./OrderManagement.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class OrderManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applyingList: [],
            borrowingList: [],
            finishedList: [],
            overdueList: [],
            invalidList: [],
            filterByUserName: "",
            filterByBookId: "",
            activeKey: "Applying"
        };
        this.references = {};
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.handleGetList = this.handleGetList.bind(this);

        this.handleFilterByUserName = this.handleFilterByUserName.bind(this);
        this.handleFilterByBookId = this.handleFilterByBookId.bind(this);

        this.handleChildClickUserName = this.handleChildClickUserName.bind(this);

        this.handleRefuse = this.handleRefuse.bind(this);
        this.handleApplyingAgree = this.handleApplyingAgree.bind(this);
        this.handleBorrowingAgree = this.handleBorrowingAgree.bind(this);
        this.handleOverdueAgree = this.handleOverdueAgree.bind(this);
    }
    handleFilterByUserName(userName){
        this.setState({
            filterByUserName: userName,
        });
    }
    handleFilterByBookId(bookId){
        this.setState({
            filterByBookId: bookId,
        });
    }

    handleFilter(list, userName, bookId){
        let result = list;
        if(userName !== ""){
            result = result.filter(item => item.userName.toLowerCase().includes(userName.toLowerCase()));
        }
        if(bookId !== ""){
            result = result.filter(item => item.bookid.toLowerCase().includes(bookId.toLowerCase()));
        }
        return result;
    }

    handleChildClickUserName(userName){
        this.references.inputUserName.value = userName;
        this.handleFilterByUserName(userName);
    }


    handleRefuse(orderId){
        const url = "/api/admin/refuse";
        const {token} = this.props;
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        axios.post(url, {
            uuid: orderId,
        }, options)
            .then(response => {
                if(response.data.type === "succeed"){
                    const {tokendate} = response.headers;
                    updateCookie(tokendate)
                    notification.success({
                        message: "Refuse Order Success!",
                        duration: 2
                    });
                    this.handleChangeTab(this.state.activeKey);
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
                    message: "Refuse Order Error Because " + err.message,
                    duration: 2
                });
            });
    }
    handleApplyingAgree(orderId){
        const url = "/api/admin/borrow";
        const {token} = this.props;
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        axios.post(url, {
            uuid: orderId,
        }, options)
            .then(response => {
                if(response.data.type === "succeed"){
                    const {tokendate} = response.headers;
                    updateCookie(tokendate)
                    notification.success({
                        message: "Agree Apply Success!",
                        duration: 2
                    });
                    this.handleChangeTab(this.state.activeKey);
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
                    message: "Agree Apply Error Because " + err.message,
                    duration: 2
                });
            });
    }
    handleBorrowingAgree(orderId, balance){
        const url = "/api/admin/return";
        const {token} = this.props;
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        axios.post(url, {
            uuid: orderId,
            newBalance: balance,
        }, options)
            .then(response => {
                if(response.data.type === "succeed"){
                    const {tokendate} = response.headers;
                    updateCookie(tokendate)
                    notification.success({
                        message: "Agree Borrow Success!",
                        duration: 2
                    });
                    this.handleChangeTab(this.state.activeKey);
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
                    message: "Agree Borrow Error Because " + err.message,
                    duration: 2
                });
            });
    }
    handleOverdueAgree(orderId, fine, bios, balance){
        if(balance - fine - bios<0){
            notification.warning({
                message: "Insufficient Balance",
                duration: 2,
            });
            return;
        }
        const url = "/api/admin/return";
        const {token} = this.props;
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
                "newBalance": balance - fine - bios
            },
        };
        axios.post(url, {
            uuid: orderId,
        }, options)
            .then(response => {
                if(response.data.type === "succeed"){
                    const {tokendate} = response.headers;
                    updateCookie(tokendate)
                    notification.success({
                        message: "Agree Overdue Success!",
                        duration: 2
                    });
                    this.handleChangeTab(this.state.activeKey);
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
                    message: "Agree Overdue Error Because " + err.message,
                    duration: 2
                });
            });
    }

    handleChangeTab(e) {
        switch (e) {
            case "Borrowing": {
                this.handleGetList("/api/user/borrowlist")
                    .then(response => {
                        if(response.data.type === "succeed"){
                            const {tokendate} = response.headers;
                            const {orderList} = response.data.data;
                            updateCookie(tokendate);
                            notification.success({
                                message: "Get BorrowingList Success!.",
                                duration: 2
                            });
                            this.setState({
                                borrowingList: orderList,
                            });
                        }
                        else if (response.data.type === "failed") {
                            throw {
                                name: "GET_BORROWLIST_ERROR",
                                message: response.data.errorReason
                            };
                        }
                    })
                    .catch(err => {
                        notification.error({
                            message: "Get BorrowingList Error Because " + err.message,
                            duration: 2
                        });
                        this.setState({
                            borrowingList: [],
                        });
                    });
            } break;
            case "Finished": {
                this.handleGetList("/api/user/returnlist")
                    .then(response => {
                        if(response.data.type === "succeed"){
                            const {tokendate} = response.headers;
                            const {orderList} = response.data.data;
                            updateCookie(tokendate);
                            notification.success({
                                message: "Get FinishedList Success!.",
                                duration: 2
                            });
                            this.setState({
                                finishedList: orderList,
                            });
                        }
                        else if (response.data.type === "failed") {
                            throw {
                                name: "GET_FINISHEDLIST_ERROR",
                                message: response.data.errorReason
                            };
                        }
                    })
                    .catch(err => {
                        notification.error({
                            message: "Get FinishedList Error Because " + err.message,
                            duration: 2
                        });
                        this.setState({
                            finishedList: [],
                        });
                    });
            } break;
            case "Overdue": {
                this.handleGetList("/api/user/overduelist")
                    .then(response => {
                        if(response.data.type === "succeed"){
                            const {tokendate} = response.headers;
                            const {orderList} = response.data.data;
                            updateCookie(tokendate);
                            notification.success({
                                message: "Get OverdueList Success!.",
                                duration: 2
                            });
                            this.setState({
                                overdueList: orderList,
                            });
                        }
                        else if (response.data.type === "failed") {
                            throw {
                                name: "GET_OVERDUEIST_ERROR",
                                message: response.data.errorReason
                            };
                            this.setState({
                                overdueList: []
                            })
                        }
                    })
                    .catch(err => {
                        notification.error({
                            message: "Get OverdueList Error Because " + err.message,
                            duration: 2
                        });
                    });
            } break;
            case "Invalid": {
                this.handleGetList("/api/user/invalidlist")
                    .then(response => {
                        if(response.data.type === "succeed"){
                            const {tokendate} = response.headers;
                            const {orderList} = response.data.data;
                            updateCookie(tokendate);
                            notification.success({
                                message: "Get InvalidgList Success!.",
                                duration: 2
                            });
                            this.setState({
                                invalidList: orderList,
                            });
                        }
                        else if (response.data.type === "failed") {
                            throw {
                                name: "GET_INVAILDLIST_ERROR",
                                message: response.data.errorReason
                            };
                        }
                    })
                    .catch(err => {
                        notification.error({
                            message: "Get InvalidList Error Because " + err.message,
                            duration: 2
                        });
                        this.setState({
                            invalidList: [],
                        })
                    });
            } break;
            default: {
                this.handleGetList("/api/user/applylist")
                    .then(response => {
                        if(response.data.type === "succeed"){
                            const {tokendate} = response.headers;
                            const {orderList} = response.data.data;
                            updateCookie(tokendate);
                            notification.success({
                                message: "Get ApplyingList Success!.",
                                duration: 2
                            });
                            this.setState({
                                applyingList: orderList,
                            });
                        }
                        else if (response.data.type === "failed") {
                            throw {
                                name: "GET_APPLYLIST_ERROR",
                                message: response.data.errorReason
                            };
                        }
                    })
                    .catch(err => {
                        notification.error({
                            message: "Get ApplyingList Error Because " + err.message,
                            duration: 2
                        });
                        this.setState({
                            applyingList: [],
                        });
                    });
            }
        }
        this.setState({
            activeKey: e,
        });
    }
    handleGetList(url) {
        const { token } = this.props;
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        return axios.get(url, options);
    }
    componentDidMount(){
        this.handleChangeTab("Applying");
    }
    render() {
        let tabBarStyle = {
            backgroundColor: "#D8D8D8",
            color: "black",
            width: "100%",
            height: "5vh"
        };
        const {filterByBookId, filterByUserName} = this.state;
        let command = {
            clickUserName: this.handleChildClickUserName,
            refuse: this.handleRefuse,
        };
        return (
            <div className={styles.orderManagement}>
                <div className={styles.filter}>
                    <div className={styles.bookId}>
                        <label htmlFor="bookId">Book's ID: </label><input type="text" id="bookId" onKeyPress={e => {e.key === "Enter" ? this.handleFilterByBookId(e.target.value) : ""}} ref={inputBookId=>this.references.inputBookId=inputBookId}/>
                    </div>
                    <div className={styles.userName}>
                        <label htmlFor="StudentID">Student ID: </label><input type="text" id="StudentID" onKeyPress={e => {e.key === "Enter" ? this.handleFilterByUserName(e.target.value) : ""}} ref={inputUserName=>this.references.inputUserName=inputUserName}/>
                    </div>
                </div>
                <Tabs defaultActiveKey="Applying" tabBarStyle={tabBarStyle} onChange={this.handleChangeTab} ref={tabs=>this.references.tabs=tabs}>
                    <TabPane tab="Applying" key="Applying" >
                        <dl className={styles.content}>
                            {this.handleFilter(this.state.applyingList, filterByUserName, filterByBookId).map( (order, index) => <ApplyingItem order={order} key={index} command={{...command, agree: this.handleApplyingAgree}} />)}
                        </dl>
                    </TabPane>
                    <TabPane tab="Borrowing" key="Borrowing" >
                        <dl className={styles.content}>
                            {this.handleFilter(this.state.borrowingList, filterByUserName, filterByBookId).map( (order, index) => <BorrowingItem order={order} key={index} command={{...command, agree: this.handleBorrowingAgree}}/>)}
                        </dl>
                    </TabPane>
                    <TabPane tab="Finished" key="Finished" >
                        <dl className={styles.content}>
                            {this.handleFilter(this.state.finishedList, filterByUserName, filterByBookId).map( (order, index) => <FinishedItem order={order} key={index} command={command}/>)}
                        </dl>
                    </TabPane>
                    <TabPane tab="Overdue" key="Overdue" >
                        <dl className={styles.content}>
                            {this.handleFilter(this.state.overdueList, filterByUserName, filterByBookId).map( (order, index) => <OverdueItem order={order} key={index} command={{...command, agree: this.handleOverdueAgree}}/>)}
                        </dl>
                    </TabPane>
                    <TabPane tab="Invalid" key="Invalid" >
                        <dl className={styles.content}>
                            {this.handleFilter(this.state.invalidList, filterByUserName, filterByBookId).map( (order, index) => <InvalidItem order={order} key={index} command={command}/>)}
                        </dl>
                    </TabPane>
                </Tabs>
            </div>

        );
    }
}

export default OrderManagement;