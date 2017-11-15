import * as React from "react";
import { Link } from "react-router-dom";
import {Popover} from "antd";

import styles from "./OverdueItem.scss";

class OverdueItem extends React.Component{
    render(){
        let {order, command} = this.props;
        const bias = (order.balance - order.fine) >= 0 ? 0 : order.balance - order.fine;
        let clickUserName = () => {
            command.clickUserName(order.studentID);
        };
        let refuse = () => {
            command.refuse(order.orderid);
        };
        let agree = () => {
            command.agree(order.orderid, this.fine.value, this.bias.value, order.balance);
        };
        return (
            <dd className={styles.overdueItem}>
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
                        <p>BorrowDate: {order.borrowDate}</p>
                        <span>OverDays: {order.overDays}</span>
                        <div>
                            <label htmlFor="Fine">Fine: </label>{command ? <input type="text" defaultValue={order.fine} id="Fine" ref={fine=>this.fine=fine}/> : <input disabled type="text" defaultValue={order.fine} id="Fine"/>}
                            <label htmlFor="Bias">Bias: </label>{command ? <input type="text" defaultValue={bias} id="Bias" ref={bias=>this.bias=bias}/> : <input disabled type="text" defaultValue={bias} id="Bias"/>}
                        </div>
                    </div>
                    <div className={styles.command}>
                    {
                        command ?
                        <div orderid={order.orderid}>
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
export default OverdueItem;