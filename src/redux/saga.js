import {fork} from "redux-saga/effects";

import {bookSearchSagas} from "../views/BookSearchRedux.js";
import {userCenterSagas} from "../components/Frame/UserCenterRedux.js";

function* rootSaga () {
    const sagasObj = {
        ...bookSearchSagas,
        ...userCenterSagas
    };

    let sagas = [];

    for (let saga in sagasObj) {
        if (sagasObj.hasOwnProperty(saga)) {
            // sagas.push(fork(sagasObj[saga]));
            yield fork(sagasObj[saga]);
        }
    }
    // yield sagas;
}

export default rootSaga;