/*eslint-disable */
import NProgress from 'nprogress';
import shortid from 'shortid';
import _ from 'lodash';
import axios from 'axios';
import base64 from 'js-base64';
import { receiveUser } from '../actions/fetchData';
import socketIOClient from 'socket.io-client';
import { API_ENDPOINT } from '../config';
import jwtDecode from 'jwt-decode';

export function getUser(dispatch) {
  const tooken = localStorage.getItem('access_token');
  const info = JSON.parse(base64.Base64.decode(tooken.split('.')[1]));
  dispatch(receiveUser(info));
}

export function isLogged() {
  return !!localStorage.getItem('access_token');
}
const IGNORE_ENDPOINT = [
  'threads?view=count&in=',
  'api/delta/',
  '/auth/bill/changelog'
];

function isIgnoreEndpoint(url) {
  return IGNORE_ENDPOINT.find(o => url.indexOf(o) !== -1);
}
let requests = [];
function onXhrEnd(request) {
  requests = requests.filter(o => o !== request);
  if (!requests.length) {
    NProgress.done();
  }
}
function increaseProgress() {
  if (requests.length) {
    NProgress.inc(0.02);
  }
}
increaseProgress = _.debounce(increaseProgress, 20);
export function listenToAjax() {
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
      if (!isIgnoreEndpoint(url)) {
        if (!requests.length && document.getElementById('navbarInput-01')) {
          NProgress.start();
          NProgress.set(0.1);
        }
        const request = shortid.generate();
        requests.push(request);
        // make smooth
        for (let i = 0 ; i < 15; i++) {
          setTimeout(() => {
            increaseProgress();
          }, i * 60);
        }
        this.addEventListener('loadend', function() {
            onXhrEnd(request);
        });
      }
      origOpen.apply(this, arguments);
      if (!url.includes('socket.io')) {
       this.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
      }
  };
}

function getAccessToken() {
  return localStorage.getItem('access_token') || '';
}

function getTokenPayload() {
  const token = getAccessToken();
  return jwtDecode(token);
}

export function setUpSocket() {
  const socket = socketIOClient(API_ENDPOINT.replace('/api', ''));
  socket.on('connect', () => {
      console.log('socket connected');
  });

  socket.on('updateBill', (dataString) => {
    console.log('update order')
    const data = JSON.parse(dataString);
    if (data.username !== getTokenPayload().username) {
        if (window.billComponent) {
          window.billComponent.getBills();
        }

        if (window.sibarComponent) {
          window.sibarComponent.getChangelog();
        }

        toastr.success(data.message, '', { timeOut: 6000, positionClass: 'toast-bottom-right' });
    }
  });
}
