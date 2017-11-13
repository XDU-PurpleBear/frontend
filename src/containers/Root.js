import normalAxios from "axios";
import Cookies from "js-cookie";
import MockAdapter from "axios-mock-adapter";

let axios = normalAxios.create();

function getCookie(){
    const token = Cookies.get("token") || null;
    const userType = Cookies.get("userType") || "visitor";
    const userName = Cookies.get("userName") || null;
    const userImage = Cookies.get("userImage") || "";
    console.log(...{token, userName, userType, userImage});
    return {token, userName, userType, userImage};
}

function updateCookie(tokendate){
    const {token, userName, userType, userImage} = getCookie();
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
    Cookies.set("userImage", userImage, {
        expires: tokendate/60/60/24,
        path: "/",
    });
}

function removeCookie(){
    Cookies.remove("token", {
        path: "/",
    });
    Cookies.remove("userType", {
        path: "/",
    });
    Cookies.remove("userName", {
        path: "/",
    });
    Cookies.remove("userImage", {
        path: "/",
    });
}

let theme = ["Arts","Business", "Computer Science", "Data Science", "Engineering", "Language Skills", "Life Science", "Mathematics", "Personal Development", "Physics", "Social Science"];

let orderStatus = ["Applying", "Borrowing ", "Finished", "Overdue", "Invalid"];

let bookCopyStatus = ["Available", "Unavailable", "Borrowed", "Reserved"];

let mock = new MockAdapter(axios);

//All failed response body is {type: "failed", errorReason: "errorReason"} headers is {"tokendate": 300}

// all url is lower

mock.onPost(/\/api\/login/).reply(config=>{
    //config like
    let request = {
        url: "/api/login",
        headers:{
            userKey: "userKey",
            password: "password",
            userType: "userType" // tel or studentID
        },
        body:{
            
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            "type": "succeed",
            data:{
                image:"/res/icon/user.png",
            }
        },
        //headers
        {
            token:"testtoken",
            tokendate: 30000, 
            usertype: "admin", //admin ,customer
            username: "testcustomer"
        },
    ];
});

mock.onPost(/\/api\/logout/).reply(config=>{
    //config like
    let request = {
        url: "/api/logout",
        headers:{
            token: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed" // need jump main page
        },
        //headers
        {},
    ];
});

mock.onGet(/\/api\/book\/query\?(bookName|theme|authorName|ISBN)\=(.*)/).reply(config=>{
    //bookType in [tags]
    //config like
    let request = {
        url: "/api/book/query?<searchType=searchValue>",
        headers:{
            token: "" //?
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data:{
                bookList:[{
                    name: "name1name1name1name1name1name1.。。",
                    ISBN: "isbn1",
                    auth: ["auth11", "auth12"],
                    position: {
                        room: "B",
                        shelf: "22",
                    },
                    language: [""],
                    theme: [""],
                    amount: 1,
                    image: "",
                }],
                filter:{
                    language: ["",""],
                    room: [""],
                    theme: ["", ""],
                }
            }
        },
        //headers
        {
            tokendate: 300 //?
        },
    ];
});

// need add history
mock.onGet(/\/api\/book\/info\?ISBN=(.*)/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/info?ISBN=11111111",
        headers:{
            token: "" //？
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                bookInfo: {
                    name: "bookinfo",
                    auth: ["bookinfo1","bookinfo1","bookinfo1"],
                    version: ["v1", "v2"],
                    ISBN: "bookinfo1",
                    publisher: "ppppppp",
                    language: ["chiness","english"],
                    position: {
                        room: "bb",
                        shelf: "121212",
                    },
                    theme: ["a", "b", "c"],
                    CLC: "aaaaaaaa",
                    amount: "3",
                    image: "/res/image/test3.gif",
                    description: "this is desc",
                    // if user is admin, copy's status is all
                    // if user is customer, copy's status only is Available
                    copys: [{
                            uuid: "11111111111111111111111111",
                            status: "Available" //Available, Borrowed, Unavailable, Reserved
                        },{
                            uuid: "2222221",
                            status: "Borrowed"
                        },{
                            uuid: "2222222",
                            status: "Borrowed"
                        },{
                            uuid: "2222223",
                            status: "Borrowed"
                        },{
                            uuid: "2222224",
                            status: "Borrowed"
                        },{
                            uuid: "2222225",
                            status: "Borrowed"
                        },{
                            uuid: "2222226",
                            status: "Borrowed"
                        },{
                            uuid: "2222227",
                            status: "Borrowed"
                        },{
                            uuid: "2222228",
                            status: "Borrowed"
                        }
                    ],
                }
            }
        },
        //headers
        {
            tokendate: 300 //?
        },
    ];
});

mock.onGet(/\/res\/image\/name/).reply(config=>{
    //config like
    let request = {
        url: "/res/image/<johnshitImage>",
        headers:{},
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        "asdasda1278agd8sd", //二进制数据
        //headers
        {
            "content-type": ""
        },
    ];
});


//only customer
mock.onGet(/\/api\/user\/info/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/info",
        headers:{
            token: ""
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                userInfo: {
                    userName: "test",
                    uuid: "aaaaaaa",
                    studentID: "1123123123",
                    tel: "112313123",
                    balance: 300,
                    userImage: "",
                    orderNumber: "2",
                    fine: 100,
                    /* 
                      if user is customer, the orderNumber is now Overdue order, if the orderNumber > 0, the fine > 0, if the orderNumber = 0, the fine 0;
                    */
                }
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});


// only admin
mock.onGet(/\/api\/user\/searchinfo/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/searchinfo",
        headers:{
            token: "",
            studentID: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                userInfo: {
                    userName: "testname",
                    uuid: "11111111",
                    studentID: "11111111111",
                    tel: "22222222222",
                    balance: 300,
                    userImage: "",
                }
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});


// only admin
mock.onPost(/\/api\/signup/).reply(config=>{
    //config like
    let request = {
        url: "/api/signup",
        headers:{
            username: "userName", //not only
            studentid: "",//only
            balance: "",
            deposit: 300, // only value
            password: "password",
            tel: "tel",//only
            token: "",
        },
        body:{
            
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            
        },
        //headers
        {
            tokendate: 300, 
        },
    ];
});

// only admin
mock.onPost(/\/api\/user\/editinfo/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/editinfo",
        headers:{
            balance: "",
            password: "password",
            uuid: "", // customer's uuid
            token: "", // admin's token
            // balance is added balance
            // if not change password , the password is ""
        },
        body:{
            
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            
        },
        //headers
        {
            tokendate: 300, 
        },
    ];
});

mock.onGet(/\/api\/book\/recommend/).reply(config=>{
    //bookType in [tags]
    //config like
    let request = {
        url: "/api/book/recommend",
        headers:{
            token: "" //?
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data:{
                bookList:[{
                    name: "name1name1",
                    ISBN: "isbn1",
                    description: "name1nam",
                    image: "/res/image/test2.jpg",
                },{
                    name: "name1name1name1name1name1name1.。。",
                    ISBN: "isbn1",
                    description: "description",
                    image: "/res/image/test2.jpg",
                },{
                    name: "name1name1name1name1name1name1.。。",
                    ISBN: "isbn1",
                    description: "description",
                    image: "/res/image/test2.jpg",
                },{
                    name: "name1name1name1name1name1name1.。。",
                    ISBN: "isbn1",
                    description: "description",
                    image: "/res/image/test2.jpg",
                }]
            }
        },
        //headers
        {
            tokendate: 300 //?
        },
    ];
});

// only admin
mock.onGet(/\/api\/book\/previewinfo/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/previewinfo",
        headers:{
            token: "",
            ISBN: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data:{
                bookInfo:{
                    name: "preview1",
                    auth: ["preview1","preview2"],
                    version: ["1", "2"],
                    publisher: "",
                    CLC: "",
                    language: ["english"],
                    theme: ["a"],
                    image: "/res/image/test3.gif",
                    description: "aaaaaaaa",
                }
            }
        },
        //headers
        {
            tokendate: 300 //?
        },
    ];
});


// only admin
mock.onPost(/\/api\/book\/addcopy/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/addcopy",
        headers:{
            token: ""
        },
        body:{
            ISBN: "",
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                uuid: "aaaaaaa",
            }
        },
        //headers
        {
            tokendate: ""
        },
    ];
});
// only admin
mock.onPost(/\/api\/book\/add/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/add",
        headers:{
            token: ""
        },
        body:{ // body is a FormData
            form: {
                name: "",
                auth: ["a1", "a2"], // backend get value like 'a1,a2'
                ISBN: "",
                publisher: "",
                CLC: "",
                version: "",
                description: "",
                language: [""],
                theme: [""],
                amount: "",
            },
            files:{ // files's item is a key-value, key is string, value is a Python FileStorage Object
                "image": {}
            }
        },
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                bookInfo: {
                    name: "bookinfo",
                    auth: ["bookinfo1"],
                    version: ["v1"],
                    ISBN: "bookinfo1",
                    publisher: "",
                    language: ["chiness",""],
                    position: ["101", "2"],
                    theme: [""],
                    CLC: "",
                    amount: "3",
                    image: "",
                    description: "this is desc",
                    copys: [{
                            uuid: "111111",
                            status: "available" //available, borrowed, unavailable, reserved
                        },{
                            uuid: "222222",
                            status: "borrowed"
                        }
                    ],
                }
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});



// only admin
// borrowed can't be deleted
mock.onPost(/\/api\/book\/deletecopy/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/deletecopy",
        headers:{
            token: ""
        },
        body:{
            uuid: "" //book's copy uuid
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed"
        },
        //headers
        {
            tokendate: "5000"
        },
    ];
});

// only admin
// check bookcopy status
mock.onPost(/\/api\/book\/editcopy/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/editcopy",
        headers:{
            token: ""
        },
        body:{
            uuid: "", //book's copy uuid
            status: ""
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed"
        },
        //headers
        {
            tokendate: "3000"
        },
    ];
});


// only customer
mock.onPost(/\/api\/user\/editimage/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/editimage",
        headers:{
            token: ""
        },
        body:{ // body is a FormData
            files:{ // files's item is a key-value, key is string, value is a Python FileStorage Object
                "image": {}
            }
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed"
        },
        //headers
        {
            tokendate: ""
        },
    ];
});


mock.onGet(/\/api\/user\/queryhistory/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/queryhistory",
        headers:{
            token: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                bookList:[{
                    name: "apply1",
                    ISBN: "apply1",
                    position: {
                        room: "b",
                        shelf: "111",
                    },
                    theme: ["Arts"],
                    language: ["English"],
                    image: "",
                },{
                    name: "apply2",
                    ISBN: "apply2",
                    position: {
                        room: "c",
                        shelf: "222",
                    },
                    theme: ["Arts"],
                    language: ["English"],
                    image: "",
                }]
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});

// only customer
// need check whether he can apply
mock.onPost(/\/api\/user\/apply/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/apply",
        headers:{
            token: ""
        },
        body:{
            uuid: "", // bookcopy's uuid

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            // type: "failed",
            // errorReason: "eeeeeeeeeeee"
        },
        //headers
        {
            tokendate: 300
        },
    ];
});

// only admin
mock.onPost(/\/api\/admin\/borrow/).reply(config=>{
    //config like
    let request = {
        url: "/api/admin/borrow",
        headers:{
            token: ""
        },
        body:{
            uuid: "", // order uuid

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
        },
        //headers
        {
            tokendate: ""
        },
    ];
});

// only admin
mock.onPost(/\/api\/admin\/return/).reply(config=>{
    //config like
    let request = {
        url: "/api/admin/return",
        headers:{
            token: ""
        },
        body:{
            uuid: "", // order uuid
            newBalance: "",
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
        },
        //headers
        {
            tokendate: ""
        },
    ];
});


// only admin
mock.onPost(/\/api\/admin\/refuse/).reply(config=>{
    //config like
    let request = {
        url: "/api/admin/refuse",
        headers:{
            token: ""
        },
        body:{
            uuid: "", // order uuid
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
        },
        //headers
        {
            tokendate: ""
        },
    ];
});


// only admin
// failed； system error or studentID error
mock.onGet(/\/api\/admin\/checkborrow/).reply(config=>{
    //config like
    let request = {
        url: "/api/admin/checkborrow",
        headers:{
            token: "",
            studentID: "",
            uuids: [""] // bookcopy's uuid, one or two
        },
        body:{
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                orderList:[{
                    orderid: "",
                    applyDate: "",

                    ISBN: "",
                    bookName: "",
                    image: "",
                    auth: [""],
                    position: {
                        room: "",
                        shelf: "",
                    },
                    amount: "",

                    userid: "",
                    userName: "",
                    balance: 250,

                }], // 0 or 1 or 2
            }
        },
        //headers
        {
            tokendate: ""
        },
    ];
});


// only admin
mock.onGet(/\/api\/admin\/checkreturn/).reply(config=>{
    //config like
    let request = {
        url: "/api/admin/checkreturn",
        headers:{
            token: "",
            studentID: "",
            uuids: [""] // bookcopy's uuid, one or two
        },
        body:{
        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                orderList:[{
                    orderid: "",
                    applyDate: "",
                    fine: 250,
                    days: 31,

                    borrowDate: "",
                    ISBN: "",
                    bookName: "",
                    image: "",
                    auth: [""],
                    position: {
                        room: "",
                        shelf: "",
                    },
                    amount: "",

                    userid: "",
                    userName: "",
                    balance: 250,

                }], // 0 or 1 or 2
            }
        },
        //headers
        {
            tokendate: ""
        },
    ];
});


// admin : all order that status is applying
// cutomer: self's order that status is applying 
mock.onGet(/\/api\/user\/applylist/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/applylist",
        headers:{
            token: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                orderList:[{
                    orderid: "applyOrderID",
                    applyDate: "applyOrderDate",
                    applyTime: "applyOrderTime",
                    
                    ISBN: "applyOrderISBN",
                    bookName: "applyOrderBookName",
                    auth: ["applyOrderAuth1", "applyOrderAuth1"],
                    image: "/res/image/test3.gif",
                    position: {
                        room: "applyOrderRoom",
                        shelf: "applyOrderRoomSelf",
                    },
                    bookid: "applyOrderBookID",
                    amount: "applyOrderBookAmount",

                    userid: "applyOrderUserID",
                    userName: "applyOrderUserName",
                    studentID: "",
                    balance: 250,
                },{
                    orderid: "applyOrderID",
                    applyDate: "applyOrderDate",
                    applyTime: "applyOrderTime",
                    
                    ISBN: "applyOrderISBN",
                    bookName: "applyOrderBookName",
                    auth: ["applyOrderAuth1", "applyOrderAuth1"],
                    image: "/res/image/test3.gif",
                    position: {
                        room: "applyOrderRoom",
                        shelf: "applyOrderRoomSelf",
                    },
                    bookid: "applyOrderBookID",
                    amount: "applyOrderBookAmount",

                    userid: "applyOrderUserID",
                    userName: "applyOrderUserName",
                    balance: 250,
                },{
                    orderid: "applyOrderID",
                    applyDate: "applyOrderDate",
                    applyTime: "applyOrderTime",
                    
                    ISBN: "applyOrderISBN",
                    bookName: "applyOrderBookName",
                    auth: ["applyOrderAuth1", "applyOrderAuth1"],
                    image: "/res/image/test3.gif",
                    position: {
                        room: "applyOrderRoom",
                        shelf: "applyOrderRoomSelf",
                    },
                    bookid: "applyOrderBookID",
                    amount: "applyOrderBookAmount",

                    userid: "applyOrderUserID",
                    userName: "applyOrderUserName",
                    balance: 250,
                },{
                    orderid: "applyOrderID",
                    applyDate: "applyOrderDate",
                    applyTime: "applyOrderTime",
                    
                    ISBN: "applyOrderISBN",
                    bookName: "applyOrderBookName",
                    auth: ["applyOrderAuth1", "applyOrderAuth1"],
                    image: "/res/image/test3.gif",
                    position: {
                        room: "applyOrderRoom",
                        shelf: "applyOrderRoomSelf",
                    },
                    bookid: "applyOrderBookID",
                    amount: "applyOrderBookAmount",

                    userid: "applyOrderUserID",
                    userName: "applyOrderUserName",
                    balance: 250,
                },{
                    orderid: "applyOrderID",
                    applyDate: "applyOrderDate",
                    applyTime: "applyOrderTime",
                    
                    ISBN: "applyOrderISBN",
                    bookName: "applyOrderBookName",
                    auth: ["applyOrderAuth1", "applyOrderAuth1"],
                    image: "/res/image/test3.gif",
                    position: {
                        room: "applyOrderRoom",
                        shelf: "applyOrderRoomSelf",
                    },
                    bookid: "applyOrderBookID",
                    amount: "applyOrderBookAmount",

                    userid: "applyOrderUserID",
                    userName: "applyOrderUserName",
                    balance: 250,
                }]
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});

mock.onGet(/\/api\/user\/returnlist/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/returnlist",
        headers:{
            token: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                orderList:[{
                    orderid: "",
                    applyDate: "",
                    
                    ISBN: "",
                    returnDate: "",
                    holdDays: 12, // returnDate - borrowDate
                    bookName: "",
                    auth: [""],
                    image: "",
                    position: {
                        room: "",
                        shelf: "",
                    },
                    bookid: "",
                    amount: "",

                    userid: "",
                    userName: "",
                    studentID: "",
                    balance: 250,
                }]
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});

mock.onGet(/\/api\/user\/borrowlist/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/borrowlist",
        headers:{
            token: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                orderList:[{
                    orderid: "",
                    applyDate: "",
                    
                    ISBN: "",
                    borrowDate: "",
                    timeLeft: "", //now - borrowDate
                    bookName: "",
                    auth: [""],
                    image: "",
                    position: {
                        room: "",
                        shelf: "",
                    },
                    bookid: "",
                    amount: "",

                    userid: "",
                    userName: "",
                    studentID: "",
                    balance: 250,
                }]
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});

mock.onGet(/\/api\/user\/overduelist/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/overduelist",
        headers:{
            token: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                orderList:[{
                    orderid: "",
                    applyDate: "",
                    
                    ISBN: "",
                    borrowDate: "",
                    overDays: 12, //now - borrowDate - 30
                    fine: 12,
                    bookName: "",
                    auth: [""],
                    image: "",
                    position: {
                        room: "",
                        shelf: "",
                    },
                    bookid: "",
                    amount: "",

                    userid: "",
                    userName: "",
                    studentID: "",
                    balance: 5,
                }]
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});


// fitst check apply, then check invaild
mock.onGet(/\/api\/user\/invalidlist/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/invalidlist",
        headers:{
            token: "",
        },
        body:{

        }
    }
    //response
    return [
        //status
        200,
        //body
        {
            type: "succeed",
            data: {
                orderList:[{
                    orderid: "",
                    applyDate: "",
                    
                    ISBN: "",
                    bookName: "",
                    invaildDate: "",
                    auth: [""],
                    image: "",
                    position: {
                        room: "",
                        shelf: "",
                    },
                    bookid: "",
                    amount: "",

                    userid: "",
                    userName: "",
                    studentID: "",
                    balance: 250,
                }]
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});



export {
    axios,
    getCookie,
    updateCookie,
    removeCookie
};

