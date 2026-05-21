import { call, put, takeEvery } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import { authRegister } from '../api/register';
import {
  USER_REGISTER,
  USER_REGISTER_COMPLETED,
  USER_REGISTER_ERROR,
  USER_REGISTER_REQUEST,
  type UserRegisterAction,
} from '../actions';

export function* userRegisterAsync(action: UserRegisterAction): SagaIterator {
  yield put({ type: USER_REGISTER_REQUEST });
  try {
    const response: Awaited<ReturnType<typeof authRegister>> = yield call(
      authRegister,
      action.payload,
    );
    yield put({
      type: USER_REGISTER_COMPLETED,
      payload: { message: response.message },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : String(error || 'Registration failed');
    yield put({ type: USER_REGISTER_ERROR, payload: message });
  }
}

export function* userRegister(): SagaIterator {
  yield takeEvery(USER_REGISTER, userRegisterAsync);
}
