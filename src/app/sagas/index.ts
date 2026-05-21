import { all } from 'redux-saga/effects';
import { userGoogleLogin, userLogin } from './auth';
import { userRegister } from './register';

export default function* rootSaga() {
  yield all([userLogin(), userGoogleLogin(), userRegister()]);
}
