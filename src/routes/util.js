import axios from 'axios';
import base64 from 'base-64';
import { receiveUser } from '../actions/fetchData';

export function getUser(dispatch) {
  const tooken = localStorage.getItem('access_token');
  const info = JSON.parse(base64.decode(tooken.split('.')[1]));
  dispatch(receiveUser(info));
}
