import { call, put, takeLatest } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOGIN_REQUEST,
  loginSuccess,
  loginFailure,
} from '../actions/authActions';

// 1. The API Call to your Symfony Handsona/AgriNest project
const loginApi = async credentials => {
  // IMPORTANT: 10.0.2.2 is the alias for your PC's localhost in Android Emulators
  const response = await fetch (
    'http://10.0.2.2:8000/api/login_check',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }
  );
  const data = await response.json();
  return data; // Should return { token: "eyJ..." }
};

// 2. The Worker Saga
function* handleLogin(action) {
  try {
    // Call the API and wait for the response
    const data = yield call(loginApi, action.payload);

    // Save the token to local storage so the user stays logged in
    yield call([AsyncStorage, 'setItem'], 'userToken', data.token);

    // Update the Redux state with the new token
    yield put(loginSuccess(data.token));
  } catch (error) {
    // Handle errors (like 401 Unauthorized)
    const message =
      error.response?.data?.message ||
      'Login failed. Please check your connection.';
    yield put(loginFailure(message));
  }
}

// 3. The Watcher Saga
export default function* watchAuth() {
  yield takeLatest(LOGIN_REQUEST, handleLogin);
}
