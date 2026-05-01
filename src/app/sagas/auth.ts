import { call, put, takeEvery } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { authLogin } from '../api/auth';
import {
  USER_LOGIN,
  USER_LOGIN_COMPLETED,
  USER_LOGIN_ERROR,
  USER_LOGIN_REQUEST,
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

export function* userLogin(): SagaIterator {
  yield takeEvery(USER_LOGIN, userLoginAsync);
}
