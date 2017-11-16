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

import styles from "./OrderList.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class OrderList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applyingList: [],
            borrowingList: [],
            finishedList: [],
            overdueList: [],
            invalidList: [],
        };
        this.handleChangeTab = this.handleChangeTab.bind(this);
        this.handleGetList = this.handleGetList.bind(this);
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
                        notification.warn({
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
                        notification.warn({
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
                        notification.warn({
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
                        notification.warn({
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
                        notification.warn({
                            message: "Get ApplyingList Error Because " + err.message,
                            duration: 2
                        });
                        this.setState({
                            applyingList: [],
                        });
                    });
            }
        }
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
        return (
            <div className={styles.orderList}>
                <p>My Order List</p>
                <Tabs defaultActiveKey="Applying" tabBarStyle={tabBarStyle} onChange={this.handleChangeTab}>
                    <TabPane tab="Applying" key="Applying" >
                        <dl className={styles.content}>
                            {this.state.applyingList.map( (order, index) => <ApplyingItem order={order} key={index}/>)}
                        </dl>
                    </TabPane>
                    <TabPane tab="Borrowing" key="Borrowing" >
                        <dl className={styles.content}>
                            {this.state.borrowingList.map( (order, index) => <BorrowingItem order={order} key={index}/>)}
                        </dl>
                    </TabPane>
                    <TabPane tab="Finished" key="Finished" >
                        <dl className={styles.content}>
                            {this.state.finishedList.map( (order, index) => <FinishedItem order={order} key={index}/>)}
                        </dl>
                    </TabPane>
                    <TabPane tab="Overdue" key="Overdue" >
                        <dl className={styles.content}>
                            {this.state.overdueList.map( (order, index) => <OverdueItem order={order} key={index}/>)}
                        </dl>
                    </TabPane>
                    <TabPane tab="Invalid" key="Invalid" >
                        <dl className={styles.content}>
                            {this.state.invalidList.map( (order, index) => <InvalidItem order={order} key={index}/>)}
                        </dl>
                    </TabPane>
                </Tabs>
            </div>

        );
    }
}

export default OrderList;