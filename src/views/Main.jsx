import * as React from "react";
import {Route, Link} from "react-router-dom";

import styles from "./Main.scss";
class Main extends React.Component{
    constructor(props){
        super(props);
        this.defaultRoute = this.defaultRoute.bind(this);
    }
    defaultRoute(){
        this.props.history.push("/booksearch");
    }
    render(){
        return (
            // <div className={styles.main} >
                <Link to="/booksearch" className={styles.main}>
                    <h1>World's Best Online Library System</h1>
                    <h3>Stay hungry, stay foolish</h3>
                </Link>
         /* </div>    */
        );
    }
}

export default Main;