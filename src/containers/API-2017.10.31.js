import normalAxios from "axios";
import MockAdapter from "axios-mock-adapter";

let axios = normalAxios.create();




let mock = new MockAdapter(axios);

//All failed response body is {type: "failed", errorReason: "errorReason"} headers is {"tokendate": 300}


//2017/10/31
mock.onPost(/\/api\/login/).reply(config=>{
    //config like
    let request = {
        url: "/api/login",
        headers:{
            userKey: "userKey",
            password: "password",
            userType: "userType"
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
                image:"",
            }
        },
        //headers
        {
            token:"testtoken",
            tokendate: 300, 
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
            type: "succeed"
        },
        //headers
        {},
    ];
});

mock.onGet(/\/api\/book\/query\?(bookName|bookType|authorName)\=(.*)/).reply(config=>{
    //bookType in [tags]
    //config like
    let request = {
        url: "/api/book/query?searchType=searchValue",
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
                    position: ["101", "2"],
                    amount: 1,
                    image: "",
                    tags: ["", ""] 
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
                    auth: ["bookinfo1"],
                    version: ["v1"],
                    ISBN: "bookinfo1",
                    language: ["chiness",""],
                    tags: [""],
                    position: ["101", "2"],
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
            tokendate: 300 //?
        },
    ];
});

mock.onPost(/\/api\/signup/).reply(config=>{
    //config like
    let request = {
        url: "/api/signup",
        headers:{
            userName: "userName",
            password: "password",
            tel: "tel",
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

mock.onGet(/\/res\/image\/name/).reply(config=>{
    //config like
    let request = {
        url: "/res/image/bookimage",
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
            "content-type": "image/jpeg" //写死的
        },
    ];
});












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

mock.onPost(/\/api\/book\/deletecopy/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/deletecopy",
        headers:{
            token: ""
        },
        body:{
            uuid: ""
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

mock.onPost(/\/api\/book\/add/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/add",
        headers:{
            token: ""
        },
        body:{
            name: "",
            auth: "",
            ISBN: "",
            edition: "",
            publisher: "",
            CLC: "",
            version: "",
            description: "",
            image: {
                data: "", //二进制格式。默认格式jpg
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
            tokendate: 300
        },
    ];
});

mock.onDelete(/\/api\/book\/delete/).reply(config=>{
    //config like
    let request = {
        url: "/api/book/delete",
        headers:{
            token: ""
        },
        body:{
            ISBN: ""
        }
    }
    console.log("delete book");
    console.log(config);
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
            tokendate: 300
        },
    ];
});

mock.onPost(/\/api\/book\/edit/).reply(config=>{
    //config like
    let request = {
        url: "api/book/edit",
        headers:{
            token: ""
        },
        body:{
            name: "",
            auth: "",
            ISBN: "",
            edition: "",
            publisher: "",
            CLC: "",
            version: "",
            description: "",
            image: {
                data: "", //二进制格式
            } 

        }
    }
    console.log("edit book");
    console.log(config);
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
            tokendate: 300
        },
    ];
});

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
                bookList:[{
                    name: "apply1",
                    ISBN: "apply1",
                    auth: ["a1"],
                    position: "b111",
                    amount: 1,
                    image: "",
                    timeLimits: "1",
                    uuid: "uuid1",
                },{
                    name: "apply2",
                    ISBN: "apply2",
                    auth: ["a2"],
                    position: "b222",
                    amount: 2,
                    image: "",
                    timeLimits: "2",
                    uuid: "uuid2",
                },{
                    name: "apply2",
                    ISBN: "apply2",
                    auth: ["a2"],
                    position: "b222",
                    amount: 2,
                    image: "",
                    timeLimits: "2",
                    uuid: "uuid2",
                },{
                    name: "apply2",
                    ISBN: "apply2",
                    auth: ["a2"],
                    position: "b222",
                    amount: 2,
                    image: "",
                    timeLimits: "2",
                    uuid: "uuid2",
                },{
                    name: "apply2",
                    ISBN: "apply2",
                    auth: ["a2"],
                    position: "b222",
                    amount: 2,
                    image: "",
                    timeLimits: "2",
                    uuid: "uuid2",
                },{
                    name: "apply2",
                    ISBN: "apply2",
                    auth: ["a2"],
                    position: "b222",
                    amount: 2,
                    image: "",
                    timeLimits: "2",
                    uuid: "uuid2",
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
                bookList:[{
                    name: "apply1",
                    ISBN: "apply1",
                    auth: ["a1"],
                    position: "b111",
                    amount: 1,
                    image: "",
                    timeLimits: "1"
                },{
                    name: "apply2",
                    ISBN: "apply2",
                    auth: ["a2"],
                    position: "b222",
                    amount: 2,
                    image: "",
                    timeLimits: "2"
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
                bookList:[{
                    name: "apply1",
                    ISBN: "apply1",
                    auth: ["a1"],
                    position: "b111",
                    amount: 1,
                    image: "",
                    timeLimits: "1"
                },{
                    name: "apply2",
                    ISBN: "apply2",
                    auth: ["a2"],
                    position: "b222",
                    amount: 2,
                    image: "",
                    timeLimits: "2"
                }]
            }
        },
        //headers
        {
            tokendate: 300
        },
    ];
});

mock.onPost(/\/api\/user\/apply/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/apply",
        headers:{
            token: ""
        },
        body:{
            uuids: [""],

        }
    }
    console.log(config);
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

mock.onPost(/\/api\/user\/borrow/).reply(config=>{
    //config like
    let request = {
        url: "/api/user/borrow",
        headers:{
            token: ""
        },
        body:{
            uuids: [""],

        }
    }
    console.log(config);
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








export {
    axios
};