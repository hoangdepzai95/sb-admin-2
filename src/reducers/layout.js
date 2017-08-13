import _ from 'lodash';
import {
  SET_ACTIVE_TAB,
  BACK_TAB,
  CHANGE_LOADING,
  PUSH_SUB_TAB,
  POP_SUB_TAB,
  SET_ACTIVE_GALLERY,
  SET_ACTIVE_CATEGORY,
  SET_ACTIVE_POST,
  SHARE_MAIN_PAGE,
} from '../actions/layout';
import { RESET_DATA } from '../actions/fetchData';
import { INIT_APP } from '../actions/auth';

const initialState = {
  activeTab: '',
  prevTab: '',
  loading: false,
  App: null,
  MainPage: null,
  stackHome: [],
  stackExperience: [],
  activeGallery: null,
  activeCategory: null,
  activePost: {
    home: null,
    experience: null,
    saved: null,
  },
  commentType: '',
  commentItemType: '',
};

const layout = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      return _.assign({}, state,
        {
          activeTab: action.tabId,
          prevTab: state.activeTab,
          commentType: action.tabId === '_comment' ? action.data.type : state.commentType,
          commentItemType: action.tabId === '_comment' ? action.data.itemType : state.commentItemType,
        },
      );
    case BACK_TAB:
      return _.assign({}, state, { activeTab: state.prevTab || state.activeTab, prevTab: '' });
    case CHANGE_LOADING:
      return _.assign({}, state, { loading: action.loading });
    case INIT_APP:
      return _.assign({}, state, { App: action.App });
    case PUSH_SUB_TAB:
      return _.assign({}, state,
        {
          [action.stackName]: _.uniq([...state[action.stackName], action.subTab]),
        },
      );
    case POP_SUB_TAB:
      return _.assign({}, state, { [action.stackName]: _.dropRight(state[action.stackName]) });
    case SET_ACTIVE_GALLERY:
      return _.assign({}, state, { activeGallery: action.id });
    case SET_ACTIVE_CATEGORY:
      return _.assign({}, state, { activeCategory: action.id });
    case SET_ACTIVE_POST: {
      const activePost = _.clone(state.activePost);
      activePost[action.postType] = action.post;
      return _.assign({}, state, { activePost });
    }
    case SHARE_MAIN_PAGE:
      return _.assign({}, state, { MainPage: action.instance });
    case RESET_DATA: {
      const cloneState = _.clone(state);
      cloneState.activeTab = 'home';
      cloneState.stackHome = [];
      cloneState.stackExperience = [];
      return cloneState;
    }
    default:
      return state;
  }
};
export default layout;
