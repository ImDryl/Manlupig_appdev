import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

// 1. Create the Saga Middleware (The messenger)
const sagaMiddleware = createSagaMiddleware();

// 2. Configure the Store (The Vault)
const store = configureStore({
  reducer: rootReducer,
  // Turn off default thunk and turn on our Saga middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// 3. Start the Saga watcher
sagaMiddleware.run(rootSaga);

export default store;
