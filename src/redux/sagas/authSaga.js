import { call, put, takeLatest } from 'redux-saga/effects';
import * as Type from '../actions/authActions';

// 1. The API Call
const loginApi = async credentials => {
  const response = await fetch('http://10.0.2.2:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  // Force an error if the password is wrong
  if (!response.ok) {
    throw new Error(data.message || 'Invalid username or password');
  }

  return data;
};

// 2. Login Saga
function* handleLogin(action) {
  yield put({ type: Type.USER_LOGIN_REQUEST }); 

  try {
    const data = yield call(loginApi, action.payload);

    // print: USER_LOGIN_COMPLETED
    yield put({ type: Type.USER_LOGIN_COMPLETED, payload: data });
  } catch (error) {
    // print: USER_LOGIN_ERROR
    yield put({ type: Type.USER_LOGIN_ERROR, payload: error.message });
  }
}

// 4. The Watcher Saga
export default function* watchAuth() {

  yield takeLatest(Type.USER_LOGIN, handleLogin);
}
