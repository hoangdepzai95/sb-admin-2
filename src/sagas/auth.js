import { takeLatest, fork, call, put } from 'redux-saga/effects';

import {
  INIT_APP,
  receiveInitApp,
  LOGIN_FACEBOOK,
  receiveLoginFaceBook,
  receiveUserInfo,
} from '../actions/auth';
import { changeLoading } from '../actions/layout';

function* initApp() {
}

function* watchInitApp() {
  yield takeLatest(INIT_APP, initApp);
}
export function* auth() {
  yield fork(watchInitApp);
}
