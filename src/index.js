import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import createBrowserHistory from 'history/createBrowserHistory'
import reducers from './reducers';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { API_ENDPOINT } from './config';
import App from './router';
import { listenToAjax, setUpSocket } from './router/util';
const store = createStore(reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
const history = createBrowserHistory();
listenToAjax();
setUpSocket();

axios.defaults.baseURL = API_ENDPOINT;
const Root = () => {
  return (
    <Provider
      store={store}
    >
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  )
}
ReactDOM.render(<Root />, document.getElementById('root'));
