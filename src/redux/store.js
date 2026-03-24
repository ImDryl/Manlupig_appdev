import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';


// Create the Saga Middleware 
const sagaMiddleware = createSagaMiddleware();

// Configure the Store 
const store = configureStore({
  reducer: rootReducer,
  // Turn off default thunk and turn on our Saga middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// Start the Saga watcher
sagaMiddleware.run(rootSaga);

export default store;
