import * as React from "react";
import {connect} from "react-redux";
import styles from "./UserCenter.scss";
import LogInOrSignUp from "../components/UserCenter/LogInOrSignUp.jsx";
import UserInfo from "../components/UserCenter/UserInfo.jsx";

@connect(state => {
    return {
        ...(state.UserCenter.default),
    };
})
class UserCenter extends React.Component {

    render(){
        const {dispatch, userType, userName}  = this.props;
        return (
            <div className={styles.userCenter}>
                {
                    this.props.userType==="visitor"?
                        <LogInOrSignUp dispatch={dispatch}/>
                        :<UserInfo userType={userType} userName={userName} dispatch={dispatch}/>
                }
            </div>
        );
    }
}

export default UserCenter;