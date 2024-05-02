import {legacy_createStore as createStore, combineReducers} from 'redux';
import filterReducer from './reducers/filterReducer';

// Combine reducers to create a rootReducer
const rootReducer = combineReducers({
  // The filterReducer handles state related to filters
  filter: filterReducer,
});

// Creating the Redux store using the rootReducer
const store = createStore(rootReducer);

export default store;
