import * as React from "react";
import { Form, Icon, Input, Button, Select} from "antd";
import sha256 from "sha256";
const FormItem = Form.Item;
const Option = Select.Option;

import {userCenterActions} from "../../views/UserCenterRedux.js";

@Form.create({})
class LogIn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectValue: "userName",
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {userKey, password, logInInfoType} = values;
                password = sha256(password);
                this.props.dispatch(userCenterActions.logIn({userKey, password, logInInfoType}));
            }
        });
    }
    handleSelectChange({key}){
        this.setState({
            selectValue: key,
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {selectValue} = this.state;

        const logInInfoTypeSelector = getFieldDecorator("logInInfoType", {
            initialValue: selectValue,
        })(
            <Select onChange={this.handleSelectChange}>
                <Option value="userName">User Name</Option>
                <Option value="tel">Tel-number</Option>
            </Select>
        );

        const logInInfoType = this.props.form.getFieldValue("logInInfoType");
        let userKeyRules = null;
        if(selectValue === "userName"){
            userKeyRules = {
                rules: [{
                    required: true,
                    message: "Please input your userName, userName's length less than 16 and more than 6!",
                    min: 6,
                    max: 16,
                }],
            }
        }
        else{
            userKeyRules = {
                rules: [{
                    required: true,
                    pattern: /^\d{11}$/,
                    message: "Please input your telNumber, tel's length is 11!",
                }],
            }
        }
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator("userKey", userKeyRules)(
                            <Input prefix={<Icon type="user" />} placeholder={logInInfoType} addonBefore={logInInfoTypeSelector}/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("password", {
                            rules: [{ required: true, message: "Please input your Password, passworld's length less than 16 and more than 6!", min: 6, max: 16}],
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
            </div>
        );
    }
}

export default LogIn;