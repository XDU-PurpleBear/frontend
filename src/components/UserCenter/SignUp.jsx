import * as React from "react";
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
import sha256 from "sha256";

import {userCenterActions} from "../../views/UserCenterRedux.js";

@Form.create()
class SignUp extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkConfirm = this.checkConfirm.bind(this);
    }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let {userName, password, tel, telPrefix} = values;
                password = sha256(password);
                this.props.dispatch(userCenterActions.signUp({userName, password, tel}));
                // console.log("Received values of form: ", values);
            }
        });
    }
    handleConfirmBlur(e){
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkConfirm(rule, value, callback){
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    }
    checkPassword(rule, value, callback){
        const form = this.props.form;
        if (value && value !== form.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const telPrefixSelector = getFieldDecorator("telPrefix", {
            initialValue: "86",
        })(
            <Select style={{ width: 60 }}>
                <Option value="+86">+86</Option>
            </Select>
        );
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="User Name" hasFeedback>
                    {getFieldDecorator("userName", {
                        rules: [{ required: true, message: "Please input your userName, userName's length less than 16 and more than 6!", whitespace: true, min: 6, max: 16,}],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="Phone Number">
                    {getFieldDecorator("tel", {
                        rules: [{ required: true, message: "Please input your telNumber, tel's length is 11!", pattern: /^\d{11}$/,}],
                    })(
                        <Input addonBefore={telPrefixSelector} style={{ width: "100%" }} />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="Password" hasFeedback>
                    {getFieldDecorator("password", {
                        rules: [{
                            required: true,
                            message: "Please input your Password, passworld's length less than 16 and more than 6!",
                            min: 6,
                            max: 16
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input type="password"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="Confirm Password" hasFeedback>
                    {getFieldDecorator("confirm", {
                        rules: [{
                            required: true, message: "Please confirm your password!",
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">Sign Up</Button>
                </FormItem>
            </Form>
        );
    }
}

export default SignUp;