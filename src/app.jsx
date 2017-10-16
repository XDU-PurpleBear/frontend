import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import Cookies from "js-cookie";
import Routes from "./routes/";
import configureStore, {sagaMiddleware} from "./redux/configureStore.js";
import DevTools from "./containers/DevTools.jsx";
import rootSaga from "./redux/saga.js";

const store = configureStore();
sagaMiddleware.run(rootSaga);

function init(){
    if(process.env.NODE_ENV === "production"){
        return (
            <div>
                <Routes />
            </div>
        );
    }
    else{
        return (
            <div>
                <Routes />
                <DevTools />
            </div>
        );
    }
}
ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            {init()}
        </Provider>
    </BrowserRouter>,
    document.getElementById("root") 
);