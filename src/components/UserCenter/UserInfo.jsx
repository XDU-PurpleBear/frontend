import * as React from "react";
import {Button} from "antd";

import {userCenterActions} from "../../views/UserCenterRedux.js";

import styles from "./UserInfo.scss";

class UserInfo extends React.Component {
    constructor(props){
        super(props);
        this.logOut = this.logOut.bind(this);
    }
    logOut(){
        this.props.dispatch(userCenterActions.logOut());
    }
    render(){
        const {userName, userType} = this.props;
        return (
            <div className={styles.userInfo}>
                    <div className={styles.logout}>
                        <Button type="primary" onClick={this.logOut}>
                            Log Out
                        </Button>
                    </div>
                    {
                        userType=== "admin"?
                            <div className={styles.admin}><h2>Welcome My Lord {userName}</h2></div>
                            :<div className={styles.customer}><h2>Welcome {userName}</h2></div>
                    }
                <div className="info"></div>
            </div>
        );
    }
}

export default UserInfo;