import * as React from "react";
import { Form, Icon, Input, Button, Select} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

import {userCenterActions} from "../../views/UserCenterRedux.js";

@Form.create({})
class LogIn extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(userCenterActions.logIn(values));
                // console.log("Received values of form: ", values);
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;

        const logInInfoTypeSelector = getFieldDecorator("logInInfoType", {
            initialValue: "userName",
        })(
            <Select>
                <Option value="userName">User Name</Option>
                <Option value="tel">Tel-number</Option>
            </Select>
        );

        const logInInfoType = this.props.form.getFieldValue("logInInfoType");

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator("userKey", {
                        rules: [{ required: true, message: "Please input your userName or telNumber" }],
                    })(
                        <Input prefix={<Icon type="user" />} placeholder={logInInfoType} addonBefore={logInInfoTypeSelector}/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator("password", {
                        rules: [{ required: true, message: "Please input your Password!" }],
                    })(
                        <Input prefix={<Icon type="lock" />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">
                        Log in
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

export default LogIn;