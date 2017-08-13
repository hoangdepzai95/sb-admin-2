export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
export const BACK_TAB = 'BACK_TAB';
export const CHANGE_LOADING = 'CHANGE_LOADING';
export const SHARE_TAB_BAR = 'SHARE_TAB_BAR';
export const PUSH_SUB_TAB = 'PUSH_SUB_TAB';
export const POP_SUB_TAB = 'POP_SUB_TAB';
export const SET_ACTIVE_GALLERY = 'SET_ACTIVE_GALLERY';
export const SET_ACTIVE_CATEGORY = 'SET_ACTIVE_CATEGORY';
export const SET_ACTIVE_POST = 'SET_ACTIVE_POST';
export const SHARE_MAIN_PAGE = 'SHARE_MAIN_PAGE';

export function setActiveTab(tabId, data) {
  return {
    type: SET_ACTIVE_TAB,
    tabId,
    data,
  };
}
export function backTab() {
  return {
    type: BACK_TAB,
  };
}
export function changeLoading(loading) {
  return {
    type: CHANGE_LOADING,
    loading,
  };
}
export function shareTabBar(tabBar) {
  return {
    type: SHARE_TAB_BAR,
    tabBar,
  };
}
export function pushSubTab(stackName, subTab) {
  return {
    type: PUSH_SUB_TAB,
    stackName,
    subTab,
  };
}

export function popSubTab(stackName) {
  return {
    type: POP_SUB_TAB,
    stackName,
  };
}

export function setActiveGallery(id) {
  return {
    type: SET_ACTIVE_GALLERY,
    id,
  };
}

export function setActiveCategory(id) {
  return {
    type: SET_ACTIVE_CATEGORY,
    id,
  };
}

export function setActivePost(post, postType) {
  return {
    type: SET_ACTIVE_POST,
    post,
    postType,
  };
}

export function sharMainPage(instance) {
  return {
    type: SHARE_MAIN_PAGE,
    instance,
  };
}
