import {fork} from "redux-saga/effects";

import {userCenterSagas} from "../views/UserCenterRedux.js";

function* rootSaga () {
    const sagasObj = {
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