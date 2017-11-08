import * as React from "react";
import { message } from "antd";
import { axios, getCookie, updateCookie } from "../../containers/Root.js";
import { connect } from "react-redux";

import styles from "./AddBook.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class AddBook extends React.Component {
    constructor(props) {
        super(props);
        this.references = {};
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSelectImage() {
        if (this.references.selectImage.files.length === 0) {
            this.references.image.src = "";
            return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(this.references.selectImage.files[0]);
        console.log(this.references.selectImage.files[0]);
        reader.onload = e => {
            this.references.image.src = e.target.result;
        };
    }
    handleSubmit(e) {
        e.preventDefault();
        const { token, userType, userName } = this.props;
        const name = this.references.name.value;
        const author = this.references.author.value;
        const ISBN = this.references.ISBN.value;
        const edition = this.references.edition.value;
        const publisher = this.references.publisher.value;
        const CLC = this.references.CLC.value;
        const version = this.references.version.value;
        const description = this.references.description.value;
        if (name.length === 0) {
            message.error("Please input BookName!");
            return;
        }
        if (ISBN.length === 0) {
            message.error("Please input ISBN!");
            return;
        }
        if (this.references.selectImage.files.length === 0) {
            message.error("Please select Image!");
            return;
        }
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        let reader = new FileReader();
        reader.readAsBinaryString(this.references.selectImage.files[0]);
        reader.onerror = e => {
            message.error("Upload Error because: " + e.message);
        }
        reader.onload = e => {
            const image = e.target.result;

            console.log({ "image": image });
            axios.post("/api/book/add", {
                name: name,
                auth: author,
                ISBN: ISBN,
                edition: edition,
                publisher: publisher,
                CLC: CLC,
                version: version,
                description: description,
                image: {
                    data: image
                }
            }, {
                    responsetype: "json",
                    headers: {
                        "token": token
                    }
                }).then(response => {
                    if (response.data.type === "succeed") {
                        const { tokendate } = response.headers;
                        updateCookie(tokendate)
                        message.success("Add Book Success!");
                    }
                    else if (response.data.type === "failed") {
                        throw {
                            message: response.data.errorReason
                        };
                    }
                    else {
                        throw {
                            message: "Network Error",
                        };
                    }
                }).catch(err => {
                    message.error("Add Book Error because " + err.message);
                });
        };
    }
    render() {

        return (
            <div className={styles.addBook} >
                <div className={styles.imageSelectArea}>
                    <img />
                    <button type="button">Select</button>
                </div>
                <div className={styles.description}>
                    <span>Description</span>
                    <textarea></textarea>
                </div>
                <div className={styles.basicInfoArea}>
                    <span>Basic Info</span>
                    <div>
                        <div>
                            <label htmlFor="ISBN">ISBN:</label><input type="text" id="ISBN" /><span>✓</span>
                        </div>
                        <div>
                            <label htmlFor="name">Name:</label><input type="text" id="name" /><span>✕</span>
                        </div>
                        <div>
                            <label htmlFor="author">Author:</label><input type="text" id="author" /><span>✓</span>
                        </div>
                        <div>
                            <label htmlFor="version">Version:</label><input type="text" id="version" /><span>✓</span>
                        </div>
                        <div>
                            <label htmlFor="publisher">Publisher:</label><input type="text" id="publisher" /><span>✓</span>
                        </div>
                        <div>
                            <label htmlFor="CLC">CLC:</label><input type="text" id="CLC" /><span>✓</span>
                        </div>
                        <div>
                            <label htmlFor="amount">Amount:</label><input type="text" id="amount" /><span>✓</span>
                        </div>

                    </div>
                </div>
                <div className={styles.tag}>
                    <span>Tag</span>
                    <div>
                        <div>
                            <label htmlFor="language">Language:</label><input type="text" id="language" /><span>✓</span>
                        </div>
                        <div>
                            <label htmlFor="Genre">Genre:</label><input type="text" id="Genre" /><span>✓</span>
                        </div>
                    </div>
                </div>
                <div className={styles.ctrl}></div>
                <div className={styles.copyCtrl}></div>
            </div>
        );
    }
}

export default AddBook;