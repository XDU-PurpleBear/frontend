import * as React from "react";
import { Tabs } from "antd";
const TabPane = Tabs.TabPane;

import styles from "./LogInOrSignUp.scss";
import SignUp from "./SignUp.jsx";
import LogIn from "./LogIn.jsx";

class LogInOrSignUp extends React.Component {
    render(){
        const {dispatch} = this.props;
        return (
            <div className={styles.logInOrSignUp}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Log In" key="1">
                        <LogIn dispatch={dispatch}/>
                    </TabPane>
                    <TabPane tab="Sign Up" key="2">
                        <SignUp dispatch={dispatch}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default LogInOrSignUp;