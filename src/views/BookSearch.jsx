import * as React from "react";
import * as PropTypes from "prop-types";
import {message} from "antd";
import {connect} from "react-redux";

import styles from "./BookSearch.scss";

import SearchForm from "../components/BookSearch/SearchForm.jsx";
import BookList from "../components/BookSearch/BookList.jsx";

@connect(state => {
    return {
        ...(state.BookSearch.default),
    };
})
class BookSearch extends React.Component{
    static propTypes = {
        bookList: PropTypes.array,
        dispatch: PropTypes.func,
        error: PropTypes.bool,
        errorReason: PropTypes.string,
        loaded: PropTypes.bool,      
        loading: PropTypes.bool,
        searchType: PropTypes.string,
        searchValue: PropTypes.string,
    }
    feedBack(){
        const {bookList, dispatch, error, errorReason, loaded, loading, searchType, searchValue} = this.props;
        if(loading){
            message.loading("Searching Book...", 3);
        }
        if(error){
            message.error("Get BookList Error.", 3);
        }
        if(loaded){
            message.success("Get BookList Succeed.", 3)
        }
        return null;
    }
    render(){
        const {bookList, dispatch, error, errorReason, loaded, loading, searchType, searchValue} = this.props;
        // this.feedBack(error, errorReason, loaded, loading);
        return (
            <div className={styles.bookSearch}>
                <div className={styles.searchForm}>
                    <SearchForm {...{dispatch, loading, searchType, searchValue}} />
                </div>
                {
                    loaded?
                        (
                            <div className={styles.bookList}>
                                <BookList bookList={this.props.bookList}/>
                            </div>
                        )
                        :(<div></div>)
                }
            </div>
        );
    }
}

export default BookSearch;