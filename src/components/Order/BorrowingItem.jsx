import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./BorrowingItem.scss";

class BorrowingItem extends React.Component{
    render(){
        let {order, command} = this.props;
        let clickUserName = () => {
            command.clickUserName(order.userName);
        };
        let refuse = () => {
            command.refuse(order.orderid);
        };
        let agree = () => {
            command.agree(order.orderid, order.balance);
        };
        return (
            <dd className={styles.borrowingItem}>
                <div className={styles.header}>
                    <p className={styles.applyDate}>{order.applyDate}</p>
                    <p className={styles.orderId}>OrderID:{order.orderid}</p>
                    <p className={styles.userName} onClick={command ? clickUserName : ()=>{}}>{order.studentID}</p>
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
                        {command ? <p>BorrowDate: {order.borrowDate}</p> : ""}
                        {command ? <p>TimeLeft: {order.timeLeft}</p> : ""}
                    </div>
                    <div className={styles.command}>
                    {
                        command ?
                        <div>
                            <button type="button" onClick={refuse}>Refuse</button>
                            <button type="button" onClick={agree}>Agree</button>
                        </div>
                        :
                        ""
                    }
                    </div>
                </div>
            </dd>
        );
    }
}
export default BorrowingItem;