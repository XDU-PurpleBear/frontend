import * as React from "react";
import * as PropTypes from "prop-types";
import {Table} from "antd";

const columns = [{
    title: "Name",
    dataIndex: "name",
    key: "name",
    className: "",
    render: text => {
        return (<a>{text}</a>);
    },
},{
    title: "CLC",
    dataIndex: "CLC",
    key: "CLC",
},{
    title: "Authors",
    dataIndex: "auth",
    key: "auth",
    render: authors => {
        return (
            <ol>
                {authors.map((author, index)=>(<li key={index+1}>{author}</li>))}
            </ol>
        );
    }
},{
    title: "Publisher",
    dataIndex: "publisher",
    key: "publisher",
},{
    title: "Edition",
    dataIndex: "edition",
    key: "edition"
}];

const BookList = ({bookList}) => {
    let title = "Can't Find Books";
    let bookListWithKey = [];
    if(bookList.length !== 0){
        title = "Search Results";
        bookListWithKey = bookList.map((book, index) => {
            book.key = index + 1;
            return book;
        });
    }
    else{
        return (
            <div className="ant-table-title">{title}</div>
        );
    }

    return (
        <Table
            columns={columns}
            dataSource = {bookListWithKey}
            bordered
            title={() => title}
        />
    );
}

BookList.propTypes = {
    bookList: PropTypes.arrayOf(PropTypes.object).isRequired,
}
BookList.defaultProps = {
    bookList: [],
}

export default BookList;