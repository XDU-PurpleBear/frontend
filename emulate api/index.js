const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer((request, response) => {
    const url = request.url;
    if (url.includes("/api/login")) {
        response.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
            "token": "123456789",
            "tokendate": 180,
            "usertype": "customer",
            "Access-Control-Allow-Headers": "Content-Type, password, userKey",
            "Access-Control-Expose-Headers": "token, tokendate, usertype",
            "Access-Control-Allow-Methods": "*"
        });
        response.end(JSON.stringify({
            type: "succeed",
            data: {}
        }));

        // response.writeHead(200, {
        //     "Content-Type": "text/plain",
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Headers": "Content-Type, password, userKey"
        // });
        // response.end(JSON.stringify({
        //     type: "failed",
        //     errorReason:"can't find this user"
        // }));

        return;
    }
    if (url.includes("/api/logout")) {
        response.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, token"            
        });
        response.end(JSON.stringify({
            type: "succeed",
            data: {}
        }));

        // response.writeHead(200, {
        //     "Content-Type": "text/plain",
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Headers": "Content-Type, token" 
        // });
        // response.end(JSON.stringify({
        //     type: "failed",
        //     errorReason:"log out failed"
        // }));

        return;
    }
    if (url.includes("/api/signup")) {
        response.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "userName, password, tel",            
        });
        response.end(JSON.stringify({
            type: "succeed",
            data: {}
        }));

        // response.writeHead(200, {
        //     "Content-Type": "text/plain",
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Headers": "userName, password, tel"
        // });
        // response.end(JSON.stringify({
        //     type: "failed",
        //     errorReason:"sign up failed"
        // }));

        return;
    }
    if (url.includes("/api/book/query")) {
        response.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
        });
        response.end(JSON.stringify({
            "type": "succeed",
            "data": {
                "bookList": [{
                    "ISBN": "ISBN1",
                    "CLC": "CLC1",
                    "name": "name1",
                    "auth": [
                        "auth11",
                        "auth12"
                    ],
                    "publisher": "publisher1",
                    "edition": "edition1",
                    "imgs": "imgs1"
                }, {
                    "ISBN": "ISBN2",
                    "CLC": "CLC2",
                    "name": "name2",
                    "auth": [
                        "auth21",
                        "auth22"
                    ],
                    "publisher": "publisher2",
                    "edition": "edition2",
                    "imgs": "imgs2"
                }, {
                    "ISBN": "ISBN3",
                    "CLC": "CLC3",
                    "name": "name3",
                    "auth": [
                        "auth31",
                        "auth32"
                    ],
                    "publisher": "publisher3",
                    "edition": "edition3",
                    "imgs": "imgs3"
                }
                ]
            }
        }));

        // response.writeHead(200, {
        //     "Content-Type": "text/plain",
        //     "Access-Control-Allow-Origin": "*",
        // });
        // response.end(JSON.stringify({
        //     type: "failed",
        //     errorReason: "can't find book"
        // }));

        return;
    }
}).listen(8085);
