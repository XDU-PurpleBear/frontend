import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./InvalidItem.scss";

class InvalidItem extends React.Component{
    render(){
        let {order, command} = this.props;
        let clickUserName = () => {
            command.clickUserName(order.userName);
        };
        return (
            <dd className={styles.invalidItem}>
                <div className={styles.header}>
                    <p className={styles.applyDate}>{order.applyDate}</p>
                    <p className={styles.orderId}>OrderID:{order.orderid}</p>
                    <p className={styles.userName} onClick={clickUserName}>{order.studentID}</p>
                </div>
                <div className={styles.content}>
                    <div className={styles.baseInfo}>
                        <img className={styles.image} src={order.image}/>
                        <Link className={styles.bookName} to={"/detail/" + order.ISBN}><span>{order.bookName}</span></Link>
                        <p className={styles.auth}>{order.auth.join(",")}</p>
                        <p className={styles.position}>{order.position.room}-{order.position.shelf}</p>
                        <p className={styles.amount}><span>{order.amount+" "}</span>Books Left</p>
                    </div>
                    <div className={styles.otherInfo}>
                        <p>InvaildDate: {order.invaildDate}</p>
                    </div>
                    <div className={styles.command}></div>
                </div>
            </dd>
        );
    }
}
export default InvalidItem;