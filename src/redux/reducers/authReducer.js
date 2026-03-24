import * as Type from '../actions/authActions';

const INITIAL_STATE = {
  data: null,
  isLoading: false,
  isError: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  console.log(action.type);

  switch (action.type) {
    case Type.USER_LOGIN_REQUEST:
      return {
        ...state,
        data: null,
        isLoading: true,
        isError: false,
      };

    case Type.USER_LOGIN_COMPLETED:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        isError: false,
      };

    case Type.USER_LOGIN_ERROR:
      return {
        data: null,
        isLoading: false,
        isError: true,
      };

    case Type.USER_LOGIN_RESET:
      return {
        ...state,
        data: null,
        isLoading: false,
        isError: false,
      };

    default:
      return state;
  }
}

export const userLogin = payload => ({
  type: Type.USER_LOGIN,
  payload,
});

export const resetLogin = () => ({
  type: Type.USER_LOGIN_RESET,
});
