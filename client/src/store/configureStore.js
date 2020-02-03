  
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

/**
 *
 * @description - Redux store configuration
 *
 * @param {Object}  initialState - inistial state of the app
 *
 * @returns {Object} - Object containing data in redux store
 */
export default function configureStore(initialState = {}) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
}