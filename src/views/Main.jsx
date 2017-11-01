import * as React from "react";
import {Route, Link} from "react-router-dom";

import styles from "./Main.scss";

import background from"../res/image/mainBackground.jpg";

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
            <img className={styles.main} src={background}>
            </img>
        );
    }
}

export default Main;