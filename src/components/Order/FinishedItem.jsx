import * as React from "react";
import { Link } from "react-router-dom";
import {Popover} from "antd";

import styles from "./FinishedItem.scss";

class FinishedItem extends React.Component{
    render(){
        let {order, command} = this.props;
        let clickUserName = () => {
            command.clickUserName(order.studentID);
        };
        return (
            <dd className={styles.finishedItem}>
                <div className={styles.header}>
                <Popover content={order.applyDate} placement="topLeft"><p className={styles.applyDate}>{order.applyDate}</p></Popover>
                <Popover content={order.orderid} placement="topLeft"><p className={styles.orderId}>OrderID:{order.orderid}</p></Popover>
                <Popover content={order.studentID} placement="topLeft"><p className={styles.userName} onClick={ command ? clickUserName : ()=>{}}>{order.studentID}</p></Popover>
                </div>
                <div className={styles.content}>
                    <div className={styles.baseInfo}>
                        <img className={styles.image} src={order.image}/>
                        <Popover content={order.bookName} placement="topLeft"><Link className={styles.bookName} to={"/detail/" + order.ISBN}><span>{order.bookName}</span></Link></Popover>
                        <Popover content={order.auth.join(" ")} placement="topLeft"><p className={styles.auth}>{order.auth.join(" ")}</p></Popover>
                        <p className={styles.position}>{order.position.room}-{order.position.shelf}</p>
                        <p className={styles.amount}><span>{order.amount+" "}</span>Books Left</p>
                    </div>
                    <div className={styles.otherInfo}>
                        <p>ReturnDate: {order.returnDate}</p>
                        <p>HoldDays: {order.holdDays}</p>
                    </div>
                    <div className={styles.command}></div>
                </div>
            </dd>
        );
    }
}
export default FinishedItem;