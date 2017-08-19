import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Panel from 'react-bootstrap/lib/Panel';
import { Button, Modal, FormControl, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import AddBill from './AddBill';

import { receiveTotalBill, receiveBill } from '../../actions/fetchData';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      customer: {
        phone: '',
        facebook: '',
        name: '',
      },
      billInfo: {
        shipping: 0,
        address: '',
        pay: 0,
        note: '',
      },
      products: [],
      type: '',
      page: 1,
    };
  }
  componentDidMount() {
    const { loaded, currentPage } = this.props;
    if (!loaded) {
      axios.get('/auth/bill/total', ).then(
        (res) => {
          this.props.dispatch(receiveTotalBill(res.data.quantity));
        }
      )
      axios.get(`auth/bill?per_page=50&page=${currentPage + 1}`)
        .then(
          (res) => {
            this.props.dispatch(receiveBill(res.data, currentPage + 1));
          },
          (error) => {

          },
        )
    }
  }
  open(type, id) {
    const bills = this.props.bills[this.state.page] || [];
    this.setState({
      showForm: true,
      type,
    });
    if (type === 'edit') {
      const bill = bills.find(o => o.id === id);
      this.setState({
        billInfo: bill,
        customer: {
          phone: bill.phone,
        },
        products: [],
      });
    } else {
      this.setState({
        customerInfo: {},
        billInfo: {},
        products: [],
      });
    }
  }
  close() {
    this.setState({
      showForm: false,
    });
  }
  onChange(type, field, e) {
    const value = e.target.value;
    if (type === 'customer' && field === 'phone' && value.length > 44) return;
    const target = _.cloneDeep(this.state[type]);
    target[field] = value;
    this.setState({ [type]: target });
  }
  replaceProduct(products, target) {
    let clone = [...products];
    clone = clone.map((product) => {
      if (product.id === target.id) {
        return target;
      }
      return product;
    });
    return clone;
  }
  logChange(v) {
    this.setState({ instock: v.value });
  }
  changeProduct(products) {
    this.setState({ products });
  }
  render() {
    const { user } = this.props;
    const { showForm, type, customer, billInfo, products, page } = this.state;
    const bills = this.props.bills[page] || [];
    var options = [
  { value: 1 , label: 'Còn hàng' },
  { value: 0, label: 'Hết hàng' }
];
    return (
      <div className="row ng-scope">
        <div className="">
        <p></p>
        <div className="text-right">
        <Button onClick={this.open.bind(this, 'add')} bsStyle="success">
          Tạo đơn hàng
        </Button>
        <AddBill
          showForm={showForm}
          close={this.close.bind(this)}
          type={type}
          parent={this}
          onChange={this.onChange}
          customer={customer}
          billInfo={billInfo}
          products={products}
          changeProduct={this.changeProduct.bind(this)}
          page={page}
        />
        </div>
        <p></p>
          <Panel header={<span>Danh sách đơn hàng </span>} >
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Trạng thái</th>
                    <th>Tên khách hàng</th>
                    <th>Số điện thoại</th>
                    <th>Facebook</th>
                    <th>Sản phẩm</th>
                    <th>Địa chỉ</th>
                    <th>Tổng thu</th>
                    <th>Ghi chú</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    bills.map((bill, index) => {
                      return (
                        <tr key={bill.id}>
                          <td>{bill.id} </td>
                          <td>{bill.status} </td>
                          <td>{bill.customer_name} </td>
                          <td>{bill.phone} </td>
                          <td>{bill.facebook} </td>
                          <td>
                            {bill.products_info}
                          </td>
                          <td>{bill.address}</td>
                          <td>{bill.pay}</td>
                          <td>{bill.note}</td>
                            <td>
                              <Button bsStyle="info" bsSize="xs" active onClick={this.open.bind(this, 'edit', bill.id)}>
                                Chỉnh sửa
                              </Button>
                            </td>
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
    currentPage: state.data.bill.currentPage,
    bills: state.data.bill.data,
    total: state.data.bill.total,
    user: state.data.user,
  };
})(Home);
