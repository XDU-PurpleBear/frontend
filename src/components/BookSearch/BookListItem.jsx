import * as React from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import {Popover} from "antd";

import styles from "./BookListItem.scss";

import {getCookie} from "../../containers/Root.js";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class BookListItem extends React.Component {
    render() {
        const { item, userType } = this.props;
        return (
            <dd className={styles.item} >
                <img src={item.image} alt="" className={styles.image} />
                <Link className={styles.bookName} to={"/detail/" + item.ISBN}>
                    <span>{item.name.length>30?item.name.substring(0,29)+"..." : item.name}</span>
                </Link>
                <Popover content={item.auth.join(" ")} lacement="top">
                    <span className={styles.author} >
                        {item.auth.join(" ")}
                    </span>
                </Popover>
                <span className={styles.position}>{item.position.room + item.position.shelf}</span>
                <span className={styles.number}>{item.amount} Books Left</span>
                {
                    userType === "visitor" ?
                    <button className={styles.apply} disabled><Link to={"/detail/" + item.ISBN}>Enter</Link></button>
                    : 
                    <button className={styles.apply}><Link to={"/detail/" + item.ISBN}>Enter</Link></button>
                    
                }
            </dd>
        );
    }
}

export default BookListItem;