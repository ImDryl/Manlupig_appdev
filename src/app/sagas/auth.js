import { call, put, takeEvery } from 'redux-saga/effects';
import { authLogin } from '../api/auth';

import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
} from '../actions';

export function* userLoginAsync(action) {
  yield put({ type: USER_LOGIN_REQUEST });
  try {
    const response = yield call(authLogin, action.payload);

    yield put({ type: USER_LOGIN_COMPLETED, payload: response });
  } catch (error) {
    const message =
      error && typeof error.message === 'string'
        ? error.message
        : String(error || 'Login failed');
    yield put({ type: USER_LOGIN_ERROR, payload: message });
  }
}

export function* userLogin() {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}
//  Hi my name is Driel but yopu can call me Dryl,
//   Im an IT student who can fix a lot of things
//   like washing machines and also your realationship
//   hahahah isnt it cool ?
    
//   Hi my name is Ralf but you can call me giy since Im a phedophile person
//    also you can call me youth since Im a buyouth person
//    you can call me anything you want
//    i love boys because i love them.

//saga > api > reducers
