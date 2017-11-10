import React from "react";
import { Link } from "react-router-dom";
import { Popover} from "antd";

import styles from "./AddBookPreview.scss";

class AddBookPreview extends React.Component {
    render() {
        const { bookInfo } = this.props;
        const copys = [];
        for(let i = 0; i < bookInfo.amount; ++i){
            copys.push({});
        }
        // console.log(bookInfo.image);
        return (
            <div className={styles.preview}>
                <div className={styles.info}>
                    <img src={bookInfo.image} className={styles.image} />
                    <div className={styles.basicInfo}>
                        <hr className={styles.hr1}/>
                        <Popover content={bookInfo.name} placement="bottom">
                            <div className={styles.name}>{bookInfo.name}</div
                        ></Popover>
                        <hr className={styles.hr2}/>
                        <dd className={styles.auth}>
                            Author:
                            {bookInfo.auth.map((auther, index) => <dl key={index}><Link to={`/booksearchresult/authorName/${auther}`}>{auther},</Link></dl>)}
                        </dd>
                        <dd className={styles.version}>
                            Version:
                            {bookInfo.version.map((item, index) => <dl key={index}>{item},</dl>)}
                        </dd>
                        <p className={styles.isbn}>ISBN: {bookInfo.ISBN}</p>
                        <p className={styles.language}>Language: {bookInfo.language.join(", ")}</p>
                        <dd className={styles.theme}>
                            Genre:
                            {bookInfo.theme.map((theme, index) => <dl key={index}><Link to={`/booksearchresult/theme/${theme}`}>{theme},</Link></dl>)}
                        </dd>
                        <p>Position: SystemDefault</p>
                        <div className={styles.amount}><span>{bookInfo.amount} </span><p>Book Left</p></div>
                        <hr className={styles.hr2}/>
                    </div>
                    <div className={styles.descriptionTitle}>Description</div>
                    <article className={styles.description}>{bookInfo.description}</article>
                </div>
                <div className={styles.command}>
                    <div>
                        <img src="/res/icon/bookCommandApplyTitle.png"/><span>SystemDefault</span>
                    </div>
                    <dd>
                        {
                            copys.map((copy, index) => (
                            <dl key={index}>
                                <div>SystemDefault</div>
                                <span>Available</span>
                                <Popover DefaultUUId placement="top">
                                    <p>DefaultUUId</p>
                                </Popover>
                                <button>Apply</button>
                            </dl>
                            ))
                        };
                    </dd>
                </div>
            </div>
        );
    }
}

export default AddBookPreview;