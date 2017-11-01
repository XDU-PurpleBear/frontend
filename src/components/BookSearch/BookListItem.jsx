import * as React from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";

import styles from "./BookListItem.scss";

@connect(state => {
    return {
        userType: state.UserCenter.default.userType,
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
                <span className={styles.author} >
                    {item.auth.join()}
                </span>
                <span className={styles.position}>{item.position}</span>
                <span className={styles.number}>{item.amount} Books Left</span>
                {
                    // userType === "visitor" ?
                    // <button className={styles.apply} disabled>Apply</button>
                    // :<button className={styles.apply}>Apply</button>
                }
            </dd>
        );
    }
}

export default BookListItem;