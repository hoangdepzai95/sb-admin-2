import _ from 'lodash';

import {
  RECEIVE_USERS,
  RECEIVE_USER,
  RECEIVE_PRODUCT,
  RECEIVE_TOTAL_BILL,
  RECEIVE_BILL,
  RECEIVE_STATUS,
  RECEIVE_CATEGORY,
  RECEIVE_CHANGELOG,
  ADD_NOTIFY,
  CHECK_NOTIFY,
  RECEIVE_NOTIFY,
} from '../actions/fetchData';

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
  bill: {
    total: 0,
    currentPage: 0,
    data: {},
    loaded: false,
    hasMore: true,
  },
  status: [],
  category: [],
  changelog: [],
  notify: [],
  checkedNotify: [],
};
const data = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USERS:
      return _.assign({}, state, { home: { loaded: true, data: action.users } });
    case RECEIVE_PRODUCT:
      return _.assign({}, state, { product: { loaded: true, data: action.product } });
    case RECEIVE_USER:
      return _.assign({}, state, { user: action.user });
    case RECEIVE_TOTAL_BILL: {
      const bill = _.clone(state.bill);
      bill.total = action.total;
      bill.loaded = true;
      return _.assign({}, state, { bill });
    }
    case RECEIVE_BILL: {
      const bill = _.cloneDeep(state.bill);
      if (action.page == 1) {
        bill.data = {};
      }
      bill.data[action.page] = action.bills;
      bill.currentPage = action.page;
      return _.assign({}, state, { bill });
    }
    case RECEIVE_STATUS:
      return _.assign({}, state, { status: action.data });
    case RECEIVE_CATEGORY:
      return _.assign({}, state, { category: action.data });
    case RECEIVE_CHANGELOG:
      return _.assign({}, state, { changelog: action.data });
    case RECEIVE_NOTIFY:
      return _.assign({}, state, { notify: action.data });
    case ADD_NOTIFY:
      return _.assign({}, state, { notify: [...action.data, ...state.notify] });
    case CHECK_NOTIFY:
      return _.assign({}, state, { checkedNotify: [...state.checkedNotify, action.id] });
    default:
      return state;
  }
};

export default data;
