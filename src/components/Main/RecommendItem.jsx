import * as React from "react";
import {Popover} from 'antd';
import {Link} from "react-router-dom";

import styles from "./RecommendItem.scss";

const RecommendItem = props => {
    const {bookInfo} = props;
    return (
        <dd className={styles.recommandItem}>
            <Link to={`/detail/${bookInfo.ISBN}`}>
                <img className={styles.image} src={bookInfo.image}/>
                <Popover content={bookInfo.name} placement="left">
                    <div className={styles.name}>{bookInfo.name}</div>
                </Popover>
                <Popover content={bookInfo.description} placement="leftTop">
                    <div className={styles.description}>{bookInfo.description}</div>
                </Popover>
                    
            </Link>
        </dd>
    );
}

export default RecommendItem;