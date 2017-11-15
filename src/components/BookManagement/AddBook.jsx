import * as React from "react";
import { notification } from "antd";
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

        let allChecksResult = this.allChecks.map(checkItem => checkItem());
        let bookInfo = new FormData();
        bookInfo.append("name", allChecksResult[1].name);
        bookInfo.append("auth", allChecksResult[2].author);
        bookInfo.append("ISBN", allChecksResult[0].ISBN);
        bookInfo.append("publisher", allChecksResult[4].publisher);
        bookInfo.append("CLC", allChecksResult[5].CLC);
        bookInfo.append("version", allChecksResult[3].version);
        bookInfo.append("description", this.references.description.value);
        bookInfo.append("language", allChecksResult[7].language);
        bookInfo.append("theme", allChecksResult[8].theme);
        bookInfo.append("amount", allChecksResult[6].amount);
        if(this.references.selectImage.files[0]){
            bookInfo.append("image", this.references.selectImage.files[0]);
        }
        else{
            bookInfo.append("image", this.references.image.src);
        }

        const { token } = this.props;
        if (!token || token === "") {
            notification.info({
                message: "Please Log In.",
                duration: 2,
            })
            this.props.history.push("/");
            return;
        }
        const url = "/api/book/add";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
            },
        };
        axios.post(url, bookInfo, options)
        .then((response)=>{
                if (response.data.type === "succeed") {
                    const {tokendate} = response.headers;
                    updateCookie(tokendate);
                    notification.success({
                        message: "Upload Book Info Success!.",
                        duration: 2
                    });
                    this.props.history.push("/bookmanagement/edit/" + allChecksResult[0].ISBN);
                }
                else if (response.data.type === "failed") {
                    if(response.data.errorReason.includes("already exist")){
                        notification.warn({
                            message: "The Book Already Exist!",
                            duration: 2
                        });
                        return;
                    }
                    throw {
                        name: "UPLOAD_BOOKINFO_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                notification.error({
                    message: "Upload Book Info Error Because " + err.message,
                    duration: 2
                });
            });
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
        this.handleUpdatePreview();
        this.setState({
            previewVisibility: !this.state.previewVisibility,
        });
    }

    handleGetBookInfoFromOther(e){
        const ISBN = this.references.ISBN.value;
        if(e.key !== "Enter" || ISBN === ""){
            return;
        }
        const {token} = this.props;
        if(!token || token === ""){
            notification.info({
                message: "Please Log In.",
                duration: 2,
            })
            this.props.history.push("/");
            return;
        }
        const url = "/api/book/previewinfo";
        let options = {
            responsetype: "json",
            headers: {
                "Cache-Control": "no-cache, no-store",
                "token": token,
                "ISBN": ISBN
            },
        };
        axios.get(url, options)
            .then((response)=>{
                if (response.data.type === "succeed") {
                    const {tokendate} = response.headers;
                    const {bookInfo} = response.data.data;
                    updateCookie(tokendate);
                    notification.success({
                        message: "Get Book Preview Info Success!.",
                        duration: 2
                    });
                    this.references.name.value = bookInfo.name;
                    this.handleBlurName();
                    this.references.author.value = bookInfo.auth.join(",");
                    this.handleBlurAuthor();
                    this.references.version.value = bookInfo.version.join(",");
                    this.handleBlurVersion();
                    this.references.publisher.value = bookInfo.publisher;
                    this.handleBlurPublisher();
                    this.references.CLC.value = bookInfo.CLC;
                    this.handleBlurCLC();
                    this.references.language.value = bookInfo.language.join(",");
                    this.handleBlurLanguage();
                    this.references.theme.value = bookInfo.theme.join(",");
                    this.handleBlurTheme();
                    this.references.description.value = bookInfo.description;
                    this.references.image.src = bookInfo.image;
                }
                else if (response.data.type === "failed") {
                    throw {
                        name: "GET_BOOKPREVIEWINFO_ERROR",
                        message: response.data.errorReason
                    };
                }
            })
            .catch((err) => {
                notification.error({
                    message: "Get Book Preview Info Error Because " + err.message,
                    duration: 2
                });
            });
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
        if(!/[0-9]+(,[0-9]+)*$/.test(version)){
            return {
                version,
                status: false,
            };
        }
        version = version.split(',');
        console.log(version);
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
            status: !Number.isNaN(amount) && amount > 0 && amount < 50,
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

    componentDidMount(){
        // this.references.ISBN.focus();
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
        return (
            <div className={styles.addBook} >
                <div className={styles.imageSelectArea}>
                    <img ref={image=>this.references.image=image}/>
                    <input type="file" accept="image/png, image/jpeg, image/gif" ref={selectImage=>this.references.selectImage=selectImage} onChange={this.handleSelectImage} />
                </div>
                <div className={styles.description}>
                    <span>Description</span>
                    <textarea defaultValue="" ref={description=>this.references.description=description}></textarea>
                </div>
                <div className={styles.basicInfoArea}>
                    <span>Basic Info</span>
                    <div>
                        <div>
                            <label htmlFor="ISBN">ISBN:</label><input autoFocus="autofocus" type="text" id="ISBN" ref={ISBN=>this.references.ISBN=ISBN} onBlur={this.handleBlurISBN} onKeyPress={this.handleGetBookInfoFromOther}/><span ref={ISBNAlert=>this.references.ISBNAlert=ISBNAlert}></span>
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
                        <img src={require("../../res/icon/bookCommandApplyTitle.png")}/><span>From CLC</span>
                    </div>
                    <dd>
                        {previewCopys.map((copy, index) => (
                            <dl key={index}>
                                <div>From CLC</div>
                                <span>{copy.status}</span>
                                <p>SystemDefault</p>
                                <button disabled>——</button>
                            </dl>
                        ))};
                    </dd>
                    <button type="button" disabled><div>+</div></button>
                </div>
                {
                    previewVisibility ? (
                    <div className={styles.addBookPreview}>
                        <div className={styles.preview}>
                            <AddBookPreview bookInfo={previewInfo}/>
                        </div>
                        <div className={styles.previewBefore}>
                            <p>Preview</p>
                            <div>
                                <button type="button" onClick={this.handleSubmit}>Upload</button>
                                <button type="button" onClick={this.handleTogglePreview}>Cancel</button>
                            </div>
                        </div>
                    </div>
                    ) : ""
                }
            </div>
        );
    }
}

export default AddBook;