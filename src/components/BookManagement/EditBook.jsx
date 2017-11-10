import * as React from "react";
import { message } from "antd";
import { connect } from "react-redux";
import { axios, getCookie, updateCookie } from "../../containers/Root.js"

import styles from "./EditBook.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class EditBook extends React.Component {
    constructor(props) {
        super(props);
        const { bookInfo } = this.props.location.state;
        this.references = {};
        this.state = {
            copys: bookInfo.copys,
        };
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.handleSaveChange = this.handleSaveChange.bind(this);
        this.handleDetele = this.handleDetele.bind(this);
        this.handleDeteleItem = this.handleDeteleItem.bind(this);
        this.handleAddItem = this.handleAddItem.bind(this);
    }
    handleDeteleItem(e){
        const uuid = e.target.getAttribute("uuid");
        const {token, userType, userName} = this.props;
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        const url = "/api/book/deletecopy";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token
            },
        };
        axios.post(url,{
            uuid:uuid,
        }, options)
        .then((response)=>{
            if (response.data.type === "succeed") {
                const {tokendate} = response.headers;
                updateCookie(tokendate);
                this.setState({
                    copys: this.state.copys.filter(copy => copy.uuid !== uuid)
                });
                message.success("Delete Book Copy Success!.");
            }
            else if (response.data.type === "failed") {
                throw {
                    name: "DELETE_BOOKCOPY_ERROR",
                    message: response.data.errorReason
                };
            }
        })
        .catch((err) => {
            message.error("Delete Book Copy Error Because " + err.message);
        });
    }
    handleAddItem(){
        const {token, userType, userName} = this.props;
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        const ISBN = this.references.ISBN.value;              
        const url = "/api/book/addcopy";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token
            },
        };
        axios.post(url,{
            ISBN: ISBN,
        }, options)
        .then((response)=>{
            if (response.data.type === "succeed") {
                const {tokendate} = response.headers;
                const {uuid} = response.data.data;
                updateCookie(tokendate);
                this.setState({
                    copys: this.state.copys.concat(uuid)
                });
                message.success("Add Book Copy Success!.");
            }
            else if (response.data.type === "failed") {
                throw {
                    name: "ADD_BOOKCOPY_ERROR",
                    message: response.data.errorReason
                };
            }
        })
        .catch((err) => {
            message.error("Add Book Copy Error Because " + err.message);
        });
    }
    handleSelectImage() {
        if (this.references.selectImage.files.length === 0) {
            this.references.image.src = "";
            return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(this.references.selectImage.files[0]);
        reader.onload = e => {
            this.references.image.src = e.target.result;
        };
    }
    handleDetele(e) {
        const { token, userType, userName } = this.props;
        if (!token || token.length === 0) {
            this.props.history.push("/");
            return;
        }
        const ISBN = this.references.ISBN.value;
        if (ISBN.length === 0) {
            message.error("Please input ISBN!");
            return;
        }
        if (token === undefined || token.length === 0) {
            message.error("Please LogIn!");
            return;
        }
        axios.delete("/api/book/delete", {
            ISBN: ISBN,
        }, {
                responsetype: "json",
                headers: {
                    "token": token
                }
            }).then(response => {
                if (response.data.type === "succeed") {
                    const { tokendate } = response.headers;
                    updateCookie(tokendate);
                    message.success("Delete Book Success!");
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
                message.error("Delete Book Error because " + err.message);
            });
    }
    handleSaveChange(e) {
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
        if (this.references.selectImage.files.length === 0 || this.references.image.src === "") {
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
            axios.post("/api/book/edit", {
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
                        updateCookie(tokendate);
                        message.success("Edit Book Success!");
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
    componentDidMount() {
        const { ISBN } = this.props.match.params;
        
        const { bookInfo } = this.props.location.state;
        this.references.name.value = bookInfo.name;
        this.references.author.value = bookInfo.auth.join();
        this.references.ISBN.value = bookInfo.ISBN;
        this.references.edition.value = "";
        this.references.publisher.value = "";
        this.references.CLC.value = "";
        this.references.version.value = bookInfo.version.join();
        this.references.description.value = bookInfo.description;
        this.references.image.src = bookInfo.image;
    }
    render() {
        const { position } = this.props.location.state.bookInfo;
        const { copys } = this.state;
        return (
            <div className={styles.editBook} >
                <img className={styles.image} ref={image => this.references.image = image} />
                <input className={styles.selectImage} type="file" accept="image/gif,image/jpeg,image/x-png,image/x-ms-bmp" onChange={this.handleSelectImage} ref={selectImage => this.references.selectImage = selectImage} lang="en" />
                <div className={styles.command}>
                    <button type="button" onClick={this.handleSaveChange}>Save</button>
                    <button type="button" onClick={this.handleDetele}>Delete</button>
                    {/* <button type="button" onClick={()=>{}}>Upload</button> */}
                </div>
                <span className={styles.addBasicInfoTitle}>Add Basic Info</span>
                <div className={styles.addBasicInfo}>
                    <label htmlFor="name">BookName</label><input required="required" type="text" id="name" ref={name => this.references.name = name} />
                    <br />
                    <label htmlFor="author">Author</label><input required="required" type="text" id="author" ref={author => this.references.author = author} />
                    <br />
                    <label htmlFor="ISBN">ISBN</label><input type="text" id="ISBN" ref={ISBN => this.references.ISBN = ISBN} />
                    <br />
                    <label htmlFor="edition">Edition</label><input type="text" id="edition" ref={edition => this.references.edition = edition} />
                    <br />
                    <label htmlFor="publisher">Publisher</label><input type="text" id="publisher" ref={publisher => this.references.publisher = publisher} />
                    <br />
                    <label htmlFor="CLC">CLC</label><input type="text" id="CLC" ref={CLC => this.references.CLC = CLC} />
                    <br />
                    <label htmlFor="version">version</label><input type="text" id="version" ref={version => this.references.version = version} />
                </div>
                <span className={styles.addDescriptionTitle}>Add Description</span>
                <textarea className={styles.addDescription} ref={description => this.references.description = description} ></textarea>
                <div className={styles.copys}>
                    <dl>
                        {copys.map((copy, index)=>{
                            return (
                                <dd key={index}>
                                    <div>
                                        <span>{position}</span>
                                        <button type="button" uuid={copy.uuid} onClick={this.handleDeteleItem}>Delete Copy</button>
                                    </div>
                                </dd>
                            );
                        })}
                    </dl>
                    <button type="button" onClick={this.handleAddItem}>Add Copy</button>
                </div>
            </div>
        );
    }
}

export default EditBook;