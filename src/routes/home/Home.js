

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import { connect } from 'react-redux';

import Pagination from 'react-bootstrap/lib/Pagination';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import s from './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="row ng-scope">
        <div className="">
          <Panel header={<span>Danh sách nhân viên </span>} >
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>Họ tên </th>
                    <th>Tên đăng nhập</th>
                    <th>Thao tác </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1 </td>
                    <td>Mark </td>
                    <td>Otto </td>
                    <td>@mdo </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}
export default withStyles(s)(Home);
