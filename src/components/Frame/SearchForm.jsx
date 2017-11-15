import * as React from "react";
import * as PropTypes from "prop-types";
import {Form, Input, Icon, Select, message, AutoComplete, notification} from "antd";

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
        this.dataSource = ["Arts","Business", "Computer Science", "Data Science", "Engineering", "Language Skills", "Life Science", "Mathematics", "Personal Development", "Physics", "Social Science"];
        this.searchBook = this.searchBook.bind(this);
        this.handlechangeSearchType = this.handlechangeSearchType.bind(this);
        this.handlechangeSearchValue = this.handlechangeSearchValue.bind(this);
        this.handlechangeThemeValue = this.handlechangeThemeValue.bind(this);
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
    handlechangeThemeValue(e){
        const searchValue = e;
        this.setState({
            searchValue: searchValue,
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
            notification.error({
                message: "Please input " + searchType,
                duration: 2,
            });
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {searchType} = this.state;
        const SearchTypeSelector = getFieldDecorator("searchType", {
            initialValue: "bookName",
        })(
            <Select onChange={this.handlechangeSearchType}>
                <Option value="bookName">Book's Name</Option>
                <Option value="theme">Genre</Option>
                <Option value="authorName">Author Name</Option>
                <Option value="ISBN">Book ISBN</Option>
            </Select>
        );
        return (
            <Form layout="inline" className={styles.form}>
                <FormItem>
                    {getFieldDecorator("searchType", {
                        initialValue: "bookName",
                    })(
                        <Select onChange={this.handlechangeSearchType}>
                            <Option value="bookName">Book's Name</Option>
                            <Option value="theme">Book's Genre</Option>
                            <Option value="authorName">Author Name</Option>
                            <Option value="ISBN">Book's ISBN</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem >
                    {
                        searchType !== "theme"?
                        <Input style={{width: "20vw"}} type="text" addonAfter={<Icon type="search" onClick={this.searchBook}/>} onChange={this.handlechangeSearchValue} onPressEnter={this.searchBook} />
                        :
                        <AutoComplete  dataSource={this.dataSource} onChange={this.handlechangeThemeValue} >
                            <Input type="text" addonAfter={<Icon type="search" onClick={this.searchBook}/>} onChange={this.handlechangeSearchValue} onPressEnter={this.searchBook} />
                        </AutoComplete >
                    }
                </FormItem>
            </Form>
        );
    }
}

export default SearchForm;