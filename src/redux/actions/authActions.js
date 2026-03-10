// 1. Define the Action Types (The exact names of the messages)
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

// 2. Create the Action Creators (Functions to easily send the messages)
export const loginRequest = credentials => ({
  type: LOGIN_REQUEST,
  payload: credentials, // { username, password }
});

export const loginSuccess = token => ({
  type: LOGIN_SUCCESS,
  payload: token, // The JWT string
});

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  payload: error, // "Invalid password"
});
