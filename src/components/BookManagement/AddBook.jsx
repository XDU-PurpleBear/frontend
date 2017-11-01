import * as React from "react";
import {message} from "antd";
import {axios} from "../../containers/Root.js";
import {connect} from "react-redux";
import Cookies from "js-cookie";

import styles from "./AddBook.scss";

@connect(state => {
    return {
        ...state.UserCenter.default,
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
            this.references.image.src= "";
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
        const {token, userType, userName} = this.props;
        const name = this.references.name.value;
        const author = this.references.author.value;
        const ISBN = this.references.ISBN.value;
        const edition = this.references.edition.value;
        const publisher = this.references.publisher.value;
        const CLC = this.references.CLC.value;
        const version = this.references.version.value;
        const description = this.references.description.value;
        if(name.length === 0){
            message.error("Please input BookName!");
            return;
        }
        if(ISBN.length === 0){
            message.error("Please input ISBN!");
            return;
        }
        if(this.references.selectImage.files.length === 0){
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
            
            console.log({"image":image});
            axios.post("/api/book/add", {
                name: name,
                auth: author,
                ISBN: ISBN,
                edition: edition,
                publisher: publisher,
                CLC: CLC,
                version: version,
                description: description,
                image:{
                    data: image
                }
            }, {
                responsetype: "json",
                headers: {
                    "token": token 
                }
            }).then(response=>{
                if(response.data.type === "succeed"){
                    const {tokendate} = response.headers;
                    Cookies.set("token", token, {
                        expires: tokendate/60/60/24,
                        path: "/",
                    });
                    Cookies.set("userType", userType, {
                        expires: tokendate/60/60/24,
                        path: "/",
                    });
                    Cookies.set("userName", userName, {
                        expires: tokendate/60/60/24,
                        path: "/",
                    });
                    message.success("Add Book Success!");
                }
                else if(response.data.type === "failed"){
                    throw {
                        message: response.data.errorReason
                    };
                }
                else{
                    throw {
                        message: "Network Error",
                    };
                }
            }).catch(err=>{
                message.error("Add Book Error because " + err.message);
            });
        };
    }
    render() {

        return (
            <div className={styles.addBook} >
                <img className={styles.image} ref={image => this.references.image = image} />
                <input className={styles.selectImage} type="file" accept="image/jpeg" onChange={this.handleSelectImage} ref={selectImage => this.references.selectImage = selectImage} lang="en"/>
                <button className={styles.upload} type="button" onClick={this.handleSubmit}>Upload</button>
                <span className={styles.addBasicInfoTitle}>Add Basic Info</span>
                <div className={styles.addBasicInfo}>
                    <label htmlFor="name">BookName</label><input required="required" type="text" id="name" ref={name=>this.references.name=name}/>
                    <br/>
                    <label htmlFor="author">Author</label><input required="required" type="text" id="author" ref={author=>this.references.author=author}/>
                    <br/>
                    <label htmlFor="ISBN">ISBN</label><input type="text" id="ISBN" ref={ISBN=>this.references.ISBN=ISBN}/>
                    <br/>
                    <label htmlFor="edition">Edition</label><input type="text" id="edition" ref={edition=>this.references.edition=edition}/>
                    <br/>
                    <label htmlFor="publisher">Publisher</label><input type="text" id="publisher" ref={publisher=>this.references.publisher=publisher}/>
                    <br/>
                    <label htmlFor="CLC">CLC</label><input type="text" id="CLC" ref={CLC=>this.references.CLC=CLC}/>
                    <br/>
                    <label htmlFor="version">version</label><input type="text" id="version" ref={version=>this.references.version=version}/>
                </div>
                <span className={styles.addDescriptionTitle}>Add Description</span>
                <textarea className={styles.addDescription} ref={description => this.references.description = description}></textarea>
            </div>
        );
    }
}

export default AddBook;