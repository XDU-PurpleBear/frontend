import { createStore, compose, applyMiddleware } from "redux";
import ThunkMiddleware from "redux-thunk";
import createSagaMiddleware from "redux-saga";

import rootRedecer from "./reducers";
import DevTools from "../containers/DevTools.jsx";

export const sagaMiddleware = createSagaMiddleware();
let finalCreateStore = null;
if (process.env.NODE_ENV === "production") {
    finalCreateStore = compose(
        applyMiddleware(
            ThunkMiddleware,
            sagaMiddleware
        )
    )(createStore);
}
else {
    finalCreateStore = compose(
        applyMiddleware(
            ThunkMiddleware,
            sagaMiddleware
        ),
        DevTools.instrument()
    )(createStore);
}

export default function configureStore(initialState) {
    const store = finalCreateStore(rootRedecer, initialState);
    return store;
}