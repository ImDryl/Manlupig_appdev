import { all } from 'redux-saga/effects';
import watchAuth from './authSaga'; // Import your new auth watcher

export default function* rootSaga() {
  yield all([
    watchAuth(), // This "wakes up" the login listener
  ]);
}
