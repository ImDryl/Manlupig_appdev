import { call, put, takeEvery } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { authLogin } from '../api/auth';
import { authGoogle } from '../api/googleAuth';
import {
  USER_GOOGLE_LOGIN,
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
  type UserGoogleLoginAction,
  type UserLoginAction,
} from '../actions';

export function* userLoginAsync(action: UserLoginAction): SagaIterator {
  yield put({ type: USER_LOGIN_REQUEST });
  try {
    const response: unknown = yield call(authLogin, action.payload);
    yield put({ type: USER_LOGIN_COMPLETED, payload: response });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error || 'Login failed');
    yield put({ type: USER_LOGIN_ERROR, payload: message });
  }
}

export function* userGoogleLoginAsync(action: UserGoogleLoginAction): SagaIterator {
  yield put({ type: USER_LOGIN_REQUEST });
  try {
    const response: unknown = yield call(authGoogle, action.payload.idToken);
    yield put({ type: USER_LOGIN_COMPLETED, payload: response });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : String(error || 'Google sign-in failed');
    yield put({ type: USER_LOGIN_ERROR, payload: message });
  }
}

export function* userLogin(): SagaIterator {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}

export function* userGoogleLogin(): SagaIterator {
  yield takeEvery(USER_GOOGLE_LOGIN, userGoogleLoginAsync);
}
