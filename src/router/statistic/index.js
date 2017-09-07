import React, { Component } from 'react';
import axios from 'axios';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl, Col } from 'react-bootstrap';
import 'rc-color-picker/assets/index.css';
import { connect } from 'react-redux';
import Select from 'react-select';
import ColorPicker from 'rc-color-picker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import _ from 'lodash';
import moment from 'moment';

import { receiveUsers, receiveStatus } from '../../actions/fetchData';
import DatePicker from './datepicker';

class Statistic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userbills: {
        startDate: moment(),
        endDate: moment().add(1, 'days'),
        data: [],
      },
      newcustomer: {
        startDate: moment().subtract(7, 'days'),
        endDate: moment().add(1, 'days'),
        by: 'day',
        data: {},
      },
     customerbills: {
       startDate: moment().subtract(30, 'days'),
       endDate: moment().add(1, 'days'),
       data: [],
     },
    };
  }
  componentDidMount() {
    this.getCusomters();
    this.onProcess('userbills');
    this.onProcess('customerbills');
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
    axios.get(`/auth/bill/statistic/${type}?start=${value.startDate.startOf('day').format('x')}&end=${value.endDate.startOf('day').format('x')}`)
    .then(
      (res) => {
        value.data = res.data.reverse();
        this.setState({ [type]: value });
      },
      (error) => {

      },
    );
  }
  getCusomters() {
    const value = this.state.newcustomer;
    if (value.data[value.by]) return;
    axios.get(`/auth/customer/statistic/?by=${value.by}&start=${value.startDate.startOf('day').format('x')}&end=${value.endDate.endOf('day').format('x')}`)
    .then(
      (res) => {
        value.data[value.by] = res.data;
        this.setState({ newcustomer: value });
      },
      (error) => {

      },
    );
  }
  onChangeNewCustomerOptions(option) {
    const newcustomer = this.state.newcustomer;
    const by = option.value;
    newcustomer.by = by;
    if (by === 'day') {
      newcustomer.startDate = moment().subtract(7, 'days');
    } else if (by === 'week') {
      newcustomer.startDate = moment().subtract(7, 'weeks');
    } else if (by === 'month') {
      newcustomer.startDate = moment().subtract(12, 'months');
    }
    this.setState({ newcustomer }, this.getCusomters);
  }
  getNewCustomerChartData() {
    const { newcustomer } = this.state;
    const rs = [];
    const data = newcustomer.data[newcustomer.by] || {};
    for (let timeStamp in data ) {
      let date ;
      if (newcustomer.by === 'month') {
        date = moment(timeStamp, 'X').format('MM/YYYY');
      } else if (newcustomer.by === 'week') {
        date = `${moment().diff(moment(timeStamp, 'X'), 'weeks')} tuần trước `;
      }else {
        date = moment(timeStamp, 'X').format('DD/MM/YYYY');
      }
      rs.push({
        time: date,
        'Ngày': date,
        'Số khách mới': data[timeStamp],
      });
    }
    return rs;
  }
  getChartWith() {
    if (window.innerWidth > 1000) {
      return 800;
    }
    return 300;
  }
  render() {
    const { customerbills, newcustomer, userbills  } = this.state;
    if (this.props.user.role > 2) return null;
    const newCusotmerOptions = [
      { value: 'day', label: '7 ngày gần nhất' },
      { value: 'week', label: '7 tuần gần nhất' },
      { value: 'month', 'label': '12 tháng gần nhất' },
    ];
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
            <div>
              <Col md={4}>
                <Select
                  name="form-field-name"
                  options={newCusotmerOptions}
                  placeholder="Thống kê theo"
                  searchable= {false}
                  clearable={false}
                  onChange={this.onChangeNewCustomerOptions.bind(this)}
                  value={newcustomer.by}
                />
              </Col>
              <p className="clear-fix"></p>
            </div>
            <LineChart width={this.getChartWith()} height={300} data={this.getNewCustomerChartData()}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
             <XAxis dataKey="time"/>
             <YAxis/>
             <CartesianGrid strokeDasharray="3 3"/>
             <Tooltip/>
             <Legend />
             <Line type="monotone" dataKey="Ngày" stroke="#8884d8" activeDot={{r: 8}}/>
             <Line type="monotone" dataKey="Số khách mới" stroke="#82ca9d" />
            </LineChart>
          </Panel>
          <Panel header={<span>Top khách mua nhiều </span>} >
            <DatePicker
              startDate={customerbills.startDate}
              endDate={customerbills.endDate}
              handleChangeStart={this.handleChangeStart.bind(this, 'customerbills')}
              handleChangeEnd={this.handleChangeEnd.bind(this, 'customerbills')}
              onProcess={this.onProcess.bind(this, 'customerbills')}
            />
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th># </th>
                    <th>Số điện thoại </th>
                    <th>Facebook </th>
                    <th>Tên </th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    customerbills.data.slice(0, 20).map((item, index) => {
                      return (
                        <tr key={item.phone}>
                          <td>{index + 1} </td>
                          <td>{item.phone} </td>
                          <td>{item.facebook} </td>
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
