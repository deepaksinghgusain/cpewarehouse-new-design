import { all, fork } from "redux-saga/effects";
import { watchUserAuth } from "./sagas/user-saga";
import { watchCart } from "./sagas/cart-saga";

export default function* rootSaga() {
	yield all([fork(watchUserAuth), fork(watchCart)]);
}

