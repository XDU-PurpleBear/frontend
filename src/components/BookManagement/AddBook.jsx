import * as React from "react";
import { message } from "antd";
import { axios, getCookie, updateCookie } from "../../containers/Root.js";
import { connect } from "react-redux";

import AddBookPreview from "./AddBookPreview.jsx";
import styles from "./AddBook.scss";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class AddBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            previewVisibility: false,
            previewButtonDisabled: false,
            previewInfo: {},
        };
        this.references = {};
        this.handleSelectImage = this.handleSelectImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGetBookInfoFromOther = this.handleGetBookInfoFromOther.bind(this);
        this.handleChangeCopyPreview = this.handleChangeCopyPreview.bind(this);
        this.handleUpdatePreview = this.handleUpdatePreview.bind(this);
        this.handleTogglePreview = this.handleTogglePreview.bind(this);

        this.handleCheckISBN = this.handleCheckISBN.bind(this);
        this.handleCheckName = this.handleCheckName.bind(this);
        this.handleCheckAuthor = this.handleCheckAuthor.bind(this);
        this.handleCheckVersion = this.handleCheckVersion.bind(this);
        this.handleCheckPublisher = this.handleCheckPublisher.bind(this);
        this.handleCheckCLC = this.handleCheckCLC.bind(this);
        this.handleCheckAmount = this.handleCheckAmount.bind(this);
        this.handleCheckLanguage = this.handleCheckLanguage.bind(this);
        this.handleCheckTheme = this.handleCheckTheme.bind(this);

        this.handleBlurISBN = this.handleBlurISBN.bind(this);
        this.handleBlurName = this.handleBlurName.bind(this);
        this.handleBlurAuthor = this.handleBlurAuthor.bind(this);
        this.handleBlurVersion = this.handleBlurVersion.bind(this);
        this.handleBlurPublisher = this.handleBlurPublisher.bind(this);
        this.handleBlurCLC = this.handleBlurCLC.bind(this);
        this.handleBlurAmount = this.handleBlurAmount.bind(this);
        this.handleBlurLanguage = this.handleBlurLanguage.bind(this);
        this.handleBlurTheme = this.handleBlurTheme.bind(this);

        this.allChecks = [
            this.handleCheckISBN,
            this.handleCheckName,
            this.handleCheckAuthor,
            this.handleCheckVersion,
            this.handleCheckPublisher,
            this.handleCheckCLC,
            this.handleCheckAmount,
            this.handleCheckLanguage,
            this.handleCheckTheme,
        ];
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

    handleUpdatePreview(){
        let allChecksResult = this.allChecks.map(checkItem => checkItem());
        let previewButtonDisabled = allChecksResult.every(item => item.status);
        if(previewButtonDisabled){

            this.setState({
                previewButtonDisabled,
                previewInfo: {
                    ISBN: allChecksResult[0].ISBN,
                    name: allChecksResult[1].name,
                    auth: allChecksResult[2].author,
                    version: allChecksResult[3].version,
                    publisher: allChecksResult[4].publisher,
                    CLC: allChecksResult[5].CLC,
                    amount: allChecksResult[6].amount,
                    language: allChecksResult[7].language,
                    theme: allChecksResult[8].theme,

                    image: this.references.image.src,
                    description: this.references.description.value,
                }
            });
        }
        this.setState({
            previewButtonDisabled,
        });
    }
    handleTogglePreview(){
        this.setState({
            previewVisibility: !this.state.previewVisibility,
        });
    }

    handleGetBookInfoFromOther(e){
        if(e.key !== "Enter"){
            return;
        }
        
        const {ISBN} = this.references.ISBN.value;
        console.log(e.key === "Enter");
    }

    handleChangeCopyPreview(){
        let checkAmount = this.handleCheckAmount();
        if(!checkAmount.status){
            return;
        }
        this.setState({
            amount:checkAmount.amount
        });
    }


    handleCheckISBN() {
        let ISBN = this.references.ISBN.value;
        return {
            ISBN,
            status: ISBN.trim().length !== 0,
        };
    }
    handleCheckName() {
        let name = this.references.name.value;
        return {
            name,
            status: name.trim().length !== 0,
        };
    }
    handleCheckAuthor() {
        let author = this.references.author.value.trim();
        author = author.split(',');
        return {
            author,
            status: author[0] !== "",
        };
    }
    handleCheckVersion() {
        let version = this.references.version.value.trim();
        version = version.split(',');
        return {
            version,
            status: version[0] !== "",
        };
    }
    handleCheckPublisher() {
        let publisher = this.references.publisher.value;
        return {
            publisher,
            status: publisher.trim().length !== 0,
        };
    }
    handleCheckCLC() {
        let CLC = this.references.CLC.value;
        return {
            CLC,
            status: CLC.trim().length !== 0,
        };
    }
    handleCheckAmount() {
        let amount = this.references.amount.value;
        amount = parseInt(amount);
        return {
            amount,
            status: !Number.isNaN(amount) && amount > 0,
        };
    }
    handleCheckLanguage() {
        let language = this.references.language.value.trim();
        language = language.split(',');
        return {
            language,
            status: language[0] !== "",
        };
    }
    handleCheckTheme() {
        let theme = this.references.theme.value.trim();
        theme = theme.split(',');
        return {
            theme,
            status: theme[0] !== "",
        };
    }


    handleBlurISBN() {
        this.references.ISBNAlert.innerText = (this.handleCheckISBN().status ? "✓" : "✕");
        this.references.ISBNAlert.style.color =  (this.handleCheckISBN().status ? "green" : "red");
        this.handleUpdatePreview();
    }
    handleBlurName() {
        this.references.nameAlert.innerText = (this.handleCheckName().status ? "✓" : "✕");
        this.references.nameAlert.style.color =  (this.handleCheckName().status ? "green" : "red");
        this.handleUpdatePreview();
    }
    handleBlurAuthor() {
        this.references.authorAlert.innerText = (this.handleCheckAuthor().status ? "✓" : "✕");
        this.references.authorAlert.style.color =  (this.handleCheckAuthor().status ? "green" : "red");
        this.handleUpdatePreview();
    }
    handleBlurVersion() {
        this.references.versionAlert.innerText = (this.handleCheckVersion().status ? "✓" : "✕");
        this.references.versionAlert.style.color =  (this.handleCheckVersion().status ? "green" : "red");
        this.handleUpdatePreview();
    }
    handleBlurPublisher(){
        this.references.publisherAlert.innerText = (this.handleCheckPublisher().status ? "✓" : "✕");
        this.references.publisherAlert.style.color =  (this.handleCheckPublisher().status ? "green" : "red");
        this.handleUpdatePreview();
    }
    handleBlurCLC() {
        this.references.CLCAlert.innerText = (this.handleCheckCLC().status ? "✓" : "✕");
        this.references.CLCAlert.style.color =  (this.handleCheckCLC().status ? "green" : "red");
        this.handleUpdatePreview();
    }
    handleBlurAmount() {
        this.references.amountAlert.innerText = (this.handleCheckAmount().status ? "✓" : "✕");
        this.references.amountAlert.style.color =  (this.handleCheckAmount().status ? "green" : "red");
        this.handleUpdatePreview();
    }
    handleBlurLanguage() {
        this.references.languageAlert.innerText = (this.handleCheckLanguage().status ? "✓" : "✕");
        this.references.languageAlert.style.color =  (this.handleCheckLanguage().status ? "green" : "red");
        this.handleUpdatePreview();
    }
    handleBlurTheme() {
        this.references.themeAlert.innerText = (this.handleCheckTheme().status ? "✓" : "✕");
        this.references.themeAlert.style.color =  (this.handleCheckTheme().status ? "green" : "red");
        this.handleUpdatePreview();
    }

    render() {
        const {amount, previewVisibility, previewButtonDisabled, previewInfo} = this.state;
        let previewCopys = [];
        for(let i = 0; i < amount; ++i){
            previewCopys.push({
                uuid: NaN,
                status: "Available"
            });
        }
        // let bookInfo={
        //     image: "/res/image/test2.jpg",
        //     name: "previewName",
        //     auth: ["previewAuth1", "previewAuth2"],
        //     version: ["previewVersion1", "previewVersion2"],
        //     ISBN: "previewISBN",
        //     language: ["English", "Chinese"],
        //     theme: ["previewTheme1", "previewTheme1"],
        //     amount: 7,
        //     description: "previewDescription"
        // };
        return (
            <div className={styles.addBook} >
                <div className={styles.imageSelectArea}>
                    <img ref={image=>this.references.image=image}/>
                    <input type="file" accept="image/png, image/jpeg, image/gif" ref={selectImage=>this.references.selectImage=selectImage} onChange={this.handleSelectImage} />
                </div>
                <div className={styles.description}>
                    <span>Description</span>
                    <textarea ref={description=>this.references.description=description}></textarea>
                </div>
                <div className={styles.basicInfoArea}>
                    <span>Basic Info</span>
                    <div>
                        <div>
                            <label htmlFor="ISBN">ISBN:</label><input type="text" id="ISBN" ref={ISBN=>this.references.ISBN=ISBN} onBlur={this.handleBlurISBN} onKeyPress={this.handleGetBookInfoFromOther}/><span ref={ISBNAlert=>this.references.ISBNAlert=ISBNAlert}></span>
                        </div>
                        <div>
                            <label htmlFor="name">Name:</label><input type="text" id="name" ref={name=>this.references.name=name} onBlur={this.handleBlurName}/><span ref={nameAlert=>this.references.nameAlert=nameAlert}></span>
                        </div>
                        <div>
                            <label htmlFor="author">Author:</label><input type="text" id="author" ref={author=>this.references.author=author} onBlur={this.handleBlurAuthor}/><span ref={authorAlert=>this.references.authorAlert=authorAlert}></span>
                        </div>
                        <div>
                            <label htmlFor="version">Version:</label><input type="text" id="version" ref={version=>this.references.version=version} onBlur={this.handleBlurVersion}/><span ref={versionAlert=>this.references.versionAlert=versionAlert}></span>
                        </div>
                        <div>
                            <label htmlFor="publisher">Publisher:</label><input type="text" id="publisher" ref={publisher=>this.references.publisher=publisher} onBlur={this.handleBlurPublisher}/><span ref={publisherAlert=>this.references.publisherAlert=publisherAlert}></span>
                        </div>
                        <div>
                            <label htmlFor="CLC">CLC:</label><input type="text" id="CLC" ref={CLC=>this.references.CLC=CLC} onBlur={this.handleBlurCLC}/><span ref={CLCAlert=>this.references.CLCAlert=CLCAlert}></span>
                        </div>
                        <div>
                            <label htmlFor="amount">Amount:</label><input type="text" id="amount" ref={amount=>this.references.amount=amount} onBlur={this.handleBlurAmount} onChange={this.handleChangeCopyPreview}/><span ref={amountAlert=>this.references.amountAlert=amountAlert}></span>
                        </div>

                    </div>
                </div>
                <div className={styles.tag}>
                    <span>Tag</span>
                    <div>
                        <div>
                            <label htmlFor="language">Language:</label><input type="text" id="language" ref={language=>this.references.language=language} onBlur={this.handleBlurLanguage}/><span ref={languageAlert=>this.references.languageAlert=languageAlert}></span>
                        </div>
                        <div>
                            <label htmlFor="Genre">Genre:</label><input type="text" id="Genre" ref={theme=>this.references.theme=theme} onBlur={this.handleBlurTheme}/><span ref={themeAlert=>this.references.themeAlert=themeAlert}></span>
                        </div>
                    </div>
                </div>
                <div className={styles.ctrl}>
                    {previewButtonDisabled ? <button type="button" onClick={this.handleTogglePreview}>Preview</button> : <button type="button" disabled>Preview</button>}
                </div>
                <div className={styles.copyCtrl}>
                    <div>
                        <img src="/res/icon/bookCommandApplyTitle.png"/><span>From CLC</span>
                    </div>
                    <dd>
                        {previewCopys.map((copy, index) => (
                            <dl key={index}>
                                <div>From CLC</div>
                                <span>{copy.status}</span>
                                <p>SystemDefault</p>
                                <button disabled >——</button>
                            </dl>
                        ))};
                    </dd>
                    <button type="button"><div>+</div></button>
                </div>
                {
                    previewVisibility ? (
                    <div className={styles.addBookPreview}>
                        <div className={styles.preview}>
                            <AddBookPreview bookInfo={previewInfo}/>
                        </div>
                        <div className={styles.previewBefore}></div>
                    </div>
                    ) : ""
                }
            </div>
        );
    }
}

export default AddBook;