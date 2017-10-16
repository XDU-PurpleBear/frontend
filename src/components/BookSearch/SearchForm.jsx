import * as React from "react";
import * as PropTypes from "prop-types";
import {Form, Input, Radio, Button, Icon} from "antd";
import {message} from "antd";

const FormItem = Form.Item;
const RadioGroup = Radio.Group

import {bookSearchActions} from "../../views/BookSearchRedux.js";

class SearchForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchType: props.searchType,
            searchValue: props.searchValue,
        };
        this.searchBook = this.searchBook.bind(this);
        this.handlechangeSearchType = this.handlechangeSearchType.bind(this);
        this.handlechangeSearchValue = this.handlechangeSearchValue.bind(this);
    }
    static propTypes = {
        searchType: PropTypes.string.isRequired,
        searchValue: PropTypes.string,
        dispatch: PropTypes.func.isRequired,
        loading: PropTypes.bool,
    };
    static defaultProps ={
        searchType: "bookname",
        searchValue: "",
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
        const {searchType, searchValue, loading} = this.state;
        const style = {
            width: 300,
        };
        return (
            <div>
                <Form>
                    <FormItem>
                        <RadioGroup defaultValue={searchType} onChange={this.handlechangeSearchType}>
                            <Radio value="bookname">Book Name</Radio>
                            <Radio value="booktype">Book Type</Radio>
                            <Radio value="ISBN">Book's ISBN</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem>
                        <Input prefix={<Icon type="search"/>} type="text" placeholder={searchType} onChange={this.handlechangeSearchValue} onPressEnter={this.searchBook}/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" disabled={this.state.searchValue.length === 0 || loading} onClick={this.searchBook}>Search</Button>
                    </FormItem>
                </Form>
                {}
            </div>
        );
    }
}

export default SearchForm;