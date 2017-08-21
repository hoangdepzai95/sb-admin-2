import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import Login from './login';
import Users from './users';
import Status from './status';
import Product from './product';
import Category from './category';
import Bill from './bill';
import Blank from './Blank';

import { isLogged } from './util';

const Main = () => {
  return (
    <div className="full-height">
      <Route path="/home" component={Header} />
      <div id="page-wrapper" className="page-wrapper">
        <Route path="/home/users" component={Users} />
        <Route path="/home/status" component={Status} />
        <Route path="/home/category" component={Category} />
        <Route path="/home/product" component={Product} />
        <Route path="/home/bill" component={Bill} />
      </div>
    </div>
  );
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isLogged() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const router = () => {
  return (
    <div>
      <Route path="/" component={Blank}/>
      <PrivateRoute path="/home" component={Main} />
      <Route path="/login" component={Login}/>
    </div>
  );
}

export default router;
