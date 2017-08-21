import React, { Component } from 'react';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl } from 'react-bootstrap';
import 'rc-color-picker/assets/index.css';
import { connect } from 'react-redux';
import Select from 'react-select';
import ColorPicker from 'rc-color-picker';
import _ from 'lodash';
import moment from 'moment';

import { receiveUsers, receiveStatus } from '../../actions/fetchData';
import DatePicker from './datepicker';

class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userbills: {
        startDate: moment().subtract(7, 'days'),
        endDate: moment(),
        data: [],
      },
      newcustomer: {
        startDate: moment(),
        endDate: moment(),
      },
     customerbills: {
       startDate: moment(),
       endDate: moment(),
     },
    };
  }
  handleChangeStart(type, e) {
    const value = this.state[type];
    value.startDate = e;
    this.setState({ [type]: value });
  }
  handleChangeEnd(type, e) {
    const value = this.state[type];
    value.endDate = e;
    this.setState({ [type]: value });
  }
  onProcess(type) {
    const value = this.state[type];
    axios.get(`/auth/bill/statistic/${type}?start=${value.startDate.format('x')}&end=${value.endDate.format('x')}`)
    .then(
      (res) => {
        value.data = res.data.reverse();
        this.setState({ [type]: value });
      },
      (error) => {

      },
    );
  }
  render() {
    const { customerbills, newcustomer, userbills  } = this.state;
    if (this.props.user.role != 1) return null;
    return (
      <div className="row ng-scope">
        <div className="">
        <p></p>
          <Panel header={<span>Thống kê đơn hàng </span>} >
            <DatePicker
              startDate={userbills.startDate}
              endDate={userbills.endDate}
              handleChangeStart={this.handleChangeStart.bind(this, 'userbills')}
              handleChangeEnd={this.handleChangeEnd.bind(this, 'userbills')}
              onProcess={this.onProcess.bind(this, 'userbills')}
            />
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>Tên nhân viên </th>
                    <th>Số lượng đơn hàng </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    userbills.data.map((item, index) => {
                      return (
                        <tr key={item.name}>
                          <td>{index + 1} </td>
                          <td>{item.name} </td>
                          <td>{item.quantity} </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </Panel>
          <Panel header={<span>Thống kê khách hàng mới </span>} >
            <DatePicker
              startDate={userbills.startDate}
              endDate={userbills.endDate}
              handleChangeStart={this.handleChangeStart.bind(this, 'newcustomer')}
              handleChangeEnd={this.handleChangeEnd.bind(this, 'newcustomer')}
              onProcess={this.onProcess.bind(this, 'newcustomer')}
            />
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>Tên nhân viên </th>
                    <th>Số lượng đơn hàng </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    userbills.data.map((item, index) => {
                      return (
                        <tr key={item.name}>
                          <td>{index + 1} </td>
                          <td>{item.name} </td>
                          <td>{item.quantity} </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </Panel>
          <Panel header={<span>Top khách mua nhiều </span>} >
          </Panel>
        </div>
      </div>
    );
  }
}
export default connect((state) => {
  return {
    status: state.data.status,
    user: state.data.user,
  };
})(Statistic);
