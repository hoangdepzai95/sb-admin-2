import _ from 'lodash';

import { RECEIVE_USERS, RECEIVE_USER, RECEIVE_PRODUCT } from '../actions/fetchData';

const initialState = {
  home: {
    loaded: false,
    data: [],
  },
  user: {},
  product: {
    loaded: false,
    data: [],
  },
};
const data = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USERS:
      return _.assign({}, state, { home: { loaded: true, data: action.users } });
    case RECEIVE_PRODUCT:
      return _.assign({}, state, { product: { loaded: true, data: action.product } });
    case RECEIVE_USER:
      return _.assign({}, state, { user: action.user });
    default:
      return state;
  }
};

export default data;
