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
                <div className={styles.title}>
                    <h2>XDU Libiary</h2>
                    <h4>World's Best Online Library Management System</h4>
                </div>
                <Tabs defaultActiveKey="1" style={{
                    background: "radial-gradient(rgba(215, 215, 215, 0.8), rgba(215, 215, 215, 0.0))"
                }}>
                    <TabPane tab="Log In" key="1" >
                        <LogIn dispatch={dispatch}/>
                    </TabPane>
                    {/* <TabPane tab="Sign Up" key="2">
                        <SignUp dispatch={dispatch}/>
                    </TabPane> */}
                </Tabs>
            </div>
        );
    }
}

export default LogInOrSignUp;