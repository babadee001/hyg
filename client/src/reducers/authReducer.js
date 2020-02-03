import {
    SET_CURRENT_USER, SET_API_STATUS
  } from '../actions/types';
  
  const INITIAL_STATE = {
    error: '',
    message: '',
    user: {},
    content: '',
    isFetching: false,
    authenticated: false,
    data: ''
  };
  
  function authReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case SET_CURRENT_USER:
        return { ...state, user: action.user, authenticated: true };
      case SET_API_STATUS:
        return { ...state, isFetching: action.isFetching };
      default:
        return state;
    }
  }
  
  export default authReducer;