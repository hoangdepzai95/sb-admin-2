

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Button from 'react-bootstrap/lib/Button';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import { connect } from 'react-redux';

import Pagination from 'react-bootstrap/lib/Pagination';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import s from './Home.css';
import { receiveUsers } from '../../actions/fetchData';

class Home extends Component {
  render() {
    const { users } = this.props;
    return (
      <div className="row ng-scope">

      </div>
    );
  }
}
export default withStyles(s)(connect((state) => {
  return {
    loaded: state.data.home.loaded,
    users: state.data.home.data,
  };
})(Home));
