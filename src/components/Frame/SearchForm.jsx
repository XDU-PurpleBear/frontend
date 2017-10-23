import * as React from "react";
import * as PropTypes from "prop-types";
import {Form, Input, Button, Icon, Select} from "antd";
import {message} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

import styles from "./SearchForm.scss";

import {bookSearchActions} from "../../views/BookSearchRedux.js";

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
        const searchType = e.target.value;
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
        this.props.dispatch(bookSearchActions.loadBookList(searchType, searchValue));
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {searchType, searchValue} = this.state;
        const SearchTypeSelector = getFieldDecorator("searchType", {
            initialValue: "bookName",
        })(
            <Select>
                <Option value="bookname">Book Name</Option>
                <Option value="booktype">Book Type</Option>
                <Option value="authorName">Author Name</Option>
                <Option value="ISBN">Book's ISBN</Option>
            </Select>
        );
        return (
            <Form layout="inline" className={styles.form}>
                <FormItem>
                    <Input type="text" addonBefore={SearchTypeSelector} suffix={<Icon type="search" />} onChange={this.handlechangeSearchValue} onPressEnter={this.searchBook}/>
                </FormItem>
            </Form>
        );
    }
}

export default SearchForm;