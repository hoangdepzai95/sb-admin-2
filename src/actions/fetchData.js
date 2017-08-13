export const GET_HOME_GALLERY = 'GET_HOME_GALLERY';
export const RECEIVE_HOME_GALLERY = 'RECEIVE_HOME_GALLERY';
export const GET_EXPERIENCE_CATEGORY = 'GET_EXPERIENCE_CATEGORY';
export const RECEIVE_EXPERIENCE_CATEGORY = 'RECEIVE_EXPERIENCE_CATEGORY';
export const RESET_DATA = 'RESET_DATA';
export const GET_POST = 'GET_GALLERY_POST';
export const RECEIVE_POST = 'RECEIVE_GALLERY_POST';
export const STOP_LOADING_POST = 'STOP_LOADING_POST';
export const GET_COMMENTS = 'GET_COMMENTS';
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';
export const POST_COMMENT = 'POST_COMMENT';
export const RECEIVE_COMMENT = 'RECEIVE_COMMENT';
export const GET_MAP_POSTS = 'GET_MAP_POSTS';
export const RECEIVE_MAP_POSTS = 'RECEIVE_MAP_POSTS';

export function getHomeGallery() {
  return {
    type: GET_HOME_GALLERY,
  };
}

export function receiveHomeGallery(galleries) {
  return {
    type: RECEIVE_HOME_GALLERY,
    galleries,
  };
}

export function resetData() {
  return {
    type: RESET_DATA,
  };
}
export function getExperienceCategory() {
  return {
    type: GET_EXPERIENCE_CATEGORY,
  };
}
export function receiveExperienceCategory(categories) {
  return {
    type: RECEIVE_EXPERIENCE_CATEGORY,
    categories,
  };
}

export function getPost(id, page, postType) {
  return {
    type: GET_POST,
    id,
    page,
    postType,
  };
}
export function receivePost(id, page, data, postType) {
  return {
    type: RECEIVE_POST,
    data,
    page,
    id,
    postType,
  };
}
export function stopLoadingPost(id, postType) {
  return {
    type: STOP_LOADING_POST,
    id,
    postType,
  };
}
export function getComments(postId, postType, page) {
  return {
    type: GET_COMMENTS,
    postId,
    postType,
    page,
  };
}
export function receiveComments(data, page) {
  return {
    type: RECEIVE_COMMENTS,
    data,
    page,
  };
}

export function postComment(userId, postType, postId, content) {
  return {
    type: POST_COMMENT,
    userId,
    postType,
    postId,
    content,
  };
}
export function receiveComment(comment) {
  return {
    type: RECEIVE_COMMENT,
    comment,
  };
}

export function getMapPosts() {
  return {
    type: GET_MAP_POSTS,
  };
}

export function receiveMapPost(data) {
  return {
    type: RECEIVE_MAP_POSTS,
    data,
  };
}
