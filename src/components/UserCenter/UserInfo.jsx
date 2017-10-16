import * as React from "react";
import {Button} from "antd";

import {userCenterActions} from "../../views/UserCenterRedux.js";

class UserInfo extends React.Component {
    constructor(props){
        super(props);
        this.logOut = this.logOut.bind(this);
    }
    logOut(){
        this.props.dispatch(userCenterActions.logOut());
    }
    render(){
        return (
            <div className="userInfo">
                <div className="logOut">
                    <Button type="primary" onClick={this.logOut}>
                        Log Out
                    </Button>
                </div>
                <div className="info"></div>
            </div>
        );
    }
}

export default UserInfo;