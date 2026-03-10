import { call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  USER_LOGIN_REQUEST,
  loginSuccess,
  loginFailure,
} from '../actions/authActions';

// 1. The API Call
const loginApi = async credentials => {
  const response = await fetch('http://10.0.2.2:8000/api/login_check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  // Force an error if the password is wrong (401 Unauthorized) so the Saga doesn't get stuck
  if (!response.ok) {
    throw new Error(data.message || 'Invalid username or password');
  }

  return data;
};

// 2. The Worker Saga
function* handleLogin(action) {
  try {
    const data = yield call(loginApi, action.payload);

    yield call([AsyncStorage, 'setItem'], 'userToken', data.token);

    // This will trigger your reducer and print: USER_LOGIN_COMPLETED
    yield put(loginSuccess(data.token));
  } catch (error) {
    // This will trigger your reducer and print: USER_LOGIN_ERROR
    yield put(loginFailure(error.message));
  }
}

// 3. The Watcher Saga
export default function* watchAuth() {
  // Fixed: Now correctly listening for the USER_LOGIN_REQUEST action
  yield takeLatest(USER_LOGIN_REQUEST, handleLogin);
}
