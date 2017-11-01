import * as React from "react";
import * as PropTypes from "prop-types";
import {Form, Input, Icon, Select, message} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

import styles from "./SearchForm.scss";

@Form.create({})
class SearchForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchType: "bookName",
            searchValue: "",
        };
        this.searchBook = this.searchBook.bind(this);
        this.handlechangeSearchType = this.handlechangeSearchType.bind(this);
        this.handlechangeSearchValue = this.handlechangeSearchValue.bind(this);
    }
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };
    static defaultProps ={
        dispatch: ()=>{},
    }

    handlechangeSearchType(e){
        const searchType = e;
        this.setState({
            searchType: searchType,
        });
    }

    handlechangeSearchValue(e){
        const searchValue = e.target.value;
        this.setState({
            searchValue: searchValue,
        });
    }

    searchBook(){
        const {searchType, searchValue} = this.state;
        if(searchValue && searchValue !== ""){
            this.props.history.push(`/booksearchresult/${searchType}/${searchValue}`);
        }
        else{
            message.error("Please input " + searchType);
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const SearchTypeSelector = getFieldDecorator("searchType", {
            initialValue: "bookName",
        })(
            <Select onChange={this.handlechangeSearchType}>
                <Option value="bookName">Book Name</Option>
                {/* <Option value="bookType">Book Type</Option> */}
                <Option value="authorName">Author Name</Option>
                {/* <Option value="ISBN">Book's ISBN</Option> */}
            </Select>
        );
        return (
            <Form layout="inline" className={styles.form}>
                <FormItem>
                    <Input type="text" addonBefore={SearchTypeSelector} addonAfter={<Icon type="search" onClick={this.searchBook}/>} onChange={this.handlechangeSearchValue} onPressEnter={this.searchBook}/>                 
                </FormItem>
            </Form>
        );
    }
}

export default SearchForm;