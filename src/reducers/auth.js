import _ from 'lodash';
import {
  RECEIVE_INIT_APP,
  RECEIVE_LOGIN_FACEBOOK,
  LOG_OUT,
  SKIP_LOGIN,
  RECEIVE_USER_INFO,
  CHANGE_LOCALE,
} from '../actions/auth';

const initialState = {
  userInfo: null,
  firstOpenApp: false,
  initDone: false,
  authType: '',
  token: '',
  locale: '',
  location: null,
};

const login = (state = initialState, action) => {
  let authType = '';
  switch (action.type) {
    case RECEIVE_INIT_APP:
      if (action.fbToken) {
        authType = 'facebook';
      } else if (action.ggToken) {
        authType = 'google';
      }
      return _.assign(
        {},
        state,
        {
          firstOpenApp: action.firstOpen !== '1',
          initDone: true,
          token: action.fbToken || action.ggToken,
          authType,
          locale: action.locale,
          location: action.location,
        },
      );
    case RECEIVE_LOGIN_FACEBOOK:
      return _.assign({}, state, { token: action.token, authType: 'facebook' });
    case LOG_OUT :
      return _.assign({}, state, { token: '', authType: 'guest', userInfo: null });
    case SKIP_LOGIN:
      return _.assign({}, state, { authType: 'guest' });
    case RECEIVE_USER_INFO:
      return _.assign({}, state, { userInfo: action.userInfo });
    case CHANGE_LOCALE:
      return _.assign({}, state, { locale: action.locale });
    default:
      return state;
  }
};
export default login;
