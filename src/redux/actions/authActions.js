// 1. Define the Action Types
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_COMPLETED = 'USER_LOGIN_COMPLETED';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const USER_LOGIN_RESET = 'USER_LOGIN_RESET';
export const USER_LOGOUT = 'USER_LOGOUT'; // Added this missing type!

// 2. Create the Action Creators
export const loginRequest = credentials => ({
  type: USER_LOGIN_REQUEST,
  payload: credentials, // { username, password }
});

export const loginSuccess = token => ({
  type: USER_LOGIN_COMPLETED,
  payload: token,
});

export const loginFailure = error => ({
  type: USER_LOGIN_ERROR, // Fixed: Changed from LOGIN_FAILURE to match your types
  payload: error,
});

export const resetLogin = () => ({
  type: USER_LOGIN_RESET,
});

export const logout = () => ({
  type: USER_LOGOUT, // Fixed: Changed from LOGOUT to match your types
});
