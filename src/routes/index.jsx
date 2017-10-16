import React from "react";
import {Route, Switch} from "react-router-dom";

import Frame from "../layouts/Frame.jsx";
import Detail from "../views/Detail.jsx";
import NotFound from "../views/NotFound.jsx";

class Routes extends React.Component {
    render(){
        return (
            <Switch>
                <Route path="/" component={Frame} />
                <Route component={NotFound} />
            </Switch>
        );
    }
}

export default Routes;