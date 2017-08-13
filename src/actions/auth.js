export const LOGIN_FACEBOOK = 'LOGIN_FACEBOOK';
export const RECEIVE_LOGIN_FACEBOOK = 'RECEIVE_LOGIN_FACEBOOK';
export const LOGIN_GOOGLE = 'LOGIN_GOOGLE';
export const INIT_APP = 'INIT_APP';
export const RECEIVE_INIT_APP = 'RECEIVE_INIT_APP';
export const LOG_OUT = 'LOG_OUT';
export const SKIP_LOGIN = 'SKIP_LOGIN';
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';
export const CHANGE_LOCALE = 'CHANGE_LOCALE';

export function initApp(App) {
  return {
    type: INIT_APP,
    App,
  };
}

export function receiveInitApp(fbToken, ggToken, firstOpen, locale, userId, location) {
  return {
    type: RECEIVE_INIT_APP,
    fbToken,
    ggToken,
    firstOpen,
    locale,
    userId,
    location,
  };
}

export function loginFaceBook() {
  return {
    type: LOGIN_FACEBOOK,
  };
}

export function loginGoogle() {
  return {
    type: LOGIN_GOOGLE,
  };
}

export function receiveLoginFaceBook(token) {
  return {
    type: RECEIVE_LOGIN_FACEBOOK,
    token,
  };
}

export function logOut() {
  return {
    type: LOG_OUT,
  };
}
export function skipLogin() {
  return {
    type: SKIP_LOGIN,
  };
}
export function receiveUserInfo(userInfo) {
  return {
    type: RECEIVE_USER_INFO,
    userInfo,
  };
}

export function changeLocale(locale) {
  return {
    type: CHANGE_LOCALE,
    locale,
  };
}
