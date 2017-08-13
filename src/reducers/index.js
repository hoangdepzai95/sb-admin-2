import { combineReducers } from 'redux';

import auth from './auth';
import layout from './layout';
import data from './data';

export default combineReducers({
  auth,
  layout,
  data,
});
