import _ from 'lodash';

import { RECEIVE_USERS, RECEIVE_USER } from '../actions/fetchData';

const initialState = {
  home: {
    loaded: false,
    data: [],
  },
  user: {},
};
const data = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USERS:
      return _.assign({}, state, { home: { loaded: true, data: action.users } });
    case RECEIVE_USER:
      return _.assign({}, state, { user: action.user });
    default:
      return state;
  }
};

export default data;
