import * as React from "react";
import { Link } from "react-router-dom";

import styles from "./OverdueItem.scss";

class OverdueItem extends React.Component{
    render(){
        let {order, command} = this.props;
        const bios = (order.balance - order.fine) >= 0 ? 0 : order.balance - order.fine;
        let clickUserName = () => {
            command.clickUserName(order.userName);
        };
        let refuse = () => {
            command.refuse(order.orderid);
        };
        let agree = () => {
            command.agree(order.orderid, order.fine, parseFloat(this.bios.value), order.balance);
        };
        return (
            <dd className={styles.overdueItem}>
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
                        <p>BorrowDate: {order.borrowDate}</p>
                        <span>OverDays: {order.overDays}</span>
                        <div>
                            <label htmlFor="Fine">Fine: </label>{command ? <input disabled type="text" defaultValue={order.fine} id="Fine"/> : <input disabled type="text" defaultValue={order.fine} id="Fine"/>}
                            <label htmlFor="Bios">Bios: </label>{command ? <input type="text" defaultValue={bios} id="Bios" ref={bios=>this.bios=bios}/> : <input disabled type="text" defaultValue={bios} id="Bios"/>}
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