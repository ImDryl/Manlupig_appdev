import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Your traditional reducer

const rootReducer = combineReducers({
  auth: authReducer,
  // You can add more reducers here later (like events, venues, etc.)
});

export default rootReducer;
